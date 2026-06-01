"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, User, Search, MessageSquare, MoreHorizontal, 
  Circle, Image as ImageIcon, Paperclip, Smile,
  ChevronLeft, Info, Plus, X,
  UserPlus, FileText, Loader2, Edit2, Trash2
} from "lucide-react";
import { 
  useGetConversationsQuery, 
  useGetMessagesQuery, 
  useSendMessageMutation,
  useMarkAsReadMutation,
  useCreateConversationMutation,
  useUploadFilesMutation,
  useUpdateMessageMutation,
  useDeleteMessageMutation
} from "@/redux/api/ChatApi";
import { useGetAllUsersQuery } from "@/redux/api/userApi";
import { useSocket } from "@/hooks/useSocket";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export function ChatManagementView() {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [editingAttachments, setEditingAttachments] = useState<string[]>([]);
  const [editingNewFiles, setEditingNewFiles] = useState<File[]>([]);
  const [newChatModalOpen, setNewChatModalOpen] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [conversationSearchQuery, setConversationSearchQuery] = useState("");
  
  const socket = useSocket();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const adminUser = useSelector((state: any) => state.auth.user);
  

  const { data: convsRes, refetch: refetchConvs, isLoading: isConversationsLoading, isFetching: isConversationsFetching } = useGetConversationsQuery(undefined);
  const { data: messagesRes, refetch: refetchMessages, isLoading: isMessagesLoading, isFetching: isMessagesFetching } = useGetMessagesQuery(activeChat, {
    skip: !activeChat
  });
  const { data: usersRes, isLoading: isUsersLoading, isFetching: isUsersFetching } = useGetAllUsersQuery({ search: userSearchQuery, limit: 5 }, {
    skip: !newChatModalOpen
  });

  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [uploadFiles, { isLoading: isUploading }] = useUploadFilesMutation();
  const [updateMessage, { isLoading: isUpdating }] = useUpdateMessageMutation();
  const [deleteMessage, { isLoading: isDeleting }] = useDeleteMessageMutation();
  const [markAsRead] = useMarkAsReadMutation();
  const [createConversation, { isLoading: isCreating }] = useCreateConversationMutation();

  const conversations = convsRes || [];
  const messages = messagesRes || [];
  const users = usersRes?.data || [];
  const filteredConversations = conversations.filter((conv: any) => {
    const text = [conv.otherParticipant?.fullName, conv.otherParticipant?.email, conv.lastMessage?.content].filter(Boolean).join(" ").toLowerCase();
    return !conversationSearchQuery || text.includes(conversationSearchQuery.toLowerCase());
  });
  const activeConversation = conversations.find((c: any) => c.id === activeChat);
  const sidebarBusy = isConversationsLoading;
  const chatBusy = isMessagesLoading || isMessagesFetching;
  const userPickerBusy = isUsersLoading || isUsersFetching;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (activeChat) {
      markAsRead(activeChat);
    }
  }, [activeChat, markAsRead]);

  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState<string | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!socket) return;

    socket.on("new_message", (message: any) => {
      if (message.conversationId === activeChat) {
        refetchMessages();
        markAsRead(activeChat);
      } else {
        refetchConvs();
      }
    });

    socket.on("message_updated", (message: any) => {
      if (message.conversationId === activeChat) {
        refetchMessages();
      }
    });

    socket.on("message_deleted", (message: any) => {
      if (message.conversationId === activeChat) {
        refetchMessages();
      }
    });

    socket.on("display_typing", (data: { senderId: string; conversationId: string; isTyping: boolean }) => {
      if (data.conversationId === activeChat) {
        setOtherUserTyping(data.isTyping ? data.senderId : null);
      }
    });

    socket.on("user_status", (data: { userId: string; status: string }) => {
      refetchConvs();
    });

    return () => {
      socket.off("new_message");
      socket.off("message_updated");
      socket.off("message_deleted");
      socket.off("display_typing");
      socket.off("user_status");
    };
  }, [socket, activeChat, refetchMessages, refetchConvs, markAsRead]);

  // Join room on active chat change
  useEffect(() => {
    if (!socket || !activeChat) return;
    
    socket.emit("conversation:join", { conversationId: activeChat });
    
    return () => {
      socket.emit("conversation:leave", { conversationId: activeChat });
    };
  }, [socket, activeChat]);

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageText(e.target.value);
    
    if (!socket || !activeChat) return;

    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", { conversationId: activeChat, isTyping: true });
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit("typing", { conversationId: activeChat, isTyping: false });
    }, 2000);
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!messageText.trim() && selectedFiles.length === 0) || !activeChat) return;

    try {
      let attachmentUrls: string[] = [];
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach((file) => {
          formData.append("files", file);
        });
        const uploadRes = await uploadFiles(formData).unwrap();
        attachmentUrls = uploadRes.data?.urls || uploadRes.urls || [];
      }

      await sendMessage({
        conversationId: activeChat,
        content: messageText.trim() || " ", // if empty text but has attachments
        attachments: attachmentUrls
      }).unwrap();
      setMessageText("");
      setSelectedFiles([]);
      refetchMessages();
      refetchConvs();
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  const handleSaveEdit = async (messageId: string) => {
    if (!editingContent.trim() && editingAttachments.length === 0 && editingNewFiles.length === 0) return;
    try {
      let uploadedUrls: string[] = [];
      if (editingNewFiles.length > 0) {
        const formData = new FormData();
        editingNewFiles.forEach((file) => formData.append("files", file));
        const uploadRes = await uploadFiles(formData).unwrap();
        uploadedUrls = uploadRes.data?.urls || uploadRes.urls || [];
      }
      
      const finalAttachments = [...editingAttachments, ...uploadedUrls];

      await updateMessage({ messageId, content: editingContent.trim() || " ", attachments: finalAttachments }).unwrap();
      setEditingMessageId(null);
      setEditingContent("");
      setEditingAttachments([]);
      setEditingNewFiles([]);
      refetchMessages();
    } catch (err) {
      console.error("Failed to edit", err);
    }
  };

  const handleDelete = async (messageId: string) => {
    if (confirm("Are you sure you want to delete this message?")) {
      setDeletingMessageId(messageId);
      try {
        await deleteMessage(messageId).unwrap();
        refetchMessages();
      } catch (err) {
        console.error("Failed to delete", err);
      } finally {
        setDeletingMessageId(null);
      }
    }
  };

  const handleStartConversation = async (userId: string) => {
    if (isCreating) return;
    try {
      const res: any = await createConversation([userId]).unwrap();
      await refetchConvs(); // Update sidebar immediately
      setActiveChat(res.id);
      setNewChatModalOpen(false);
      setUserSearchQuery("");
      toast.success("Conversation started");
    } catch (err) {
      toast.error("Failed to start conversation");
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] md:h-[calc(100vh-160px)] flex flex-col md:flex-row bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative">
      {/* Sidebar: Conversations List */}
      <div className={`w-full md:w-80 lg:w-96 border-r border-gray-50 flex flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 sm:p-6 border-b border-gray-50 bg-white/95 backdrop-blur sticky top-0 z-10">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl font-bold text-gray-900">Messages</h2>
            <button 
              onClick={() => setNewChatModalOpen(true)}
              className="p-2 bg-gray-900 text-white rounded-xl hover:bg-black transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              value={conversationSearchQuery}
              onChange={(e) => setConversationSearchQuery(e.target.value)}
              className="w-full h-11 bg-gray-50 border-none rounded-xl pl-11 pr-4 text-sm font-medium outline-none focus:ring-1 focus:ring-[#85A1D1] transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 sm:p-0">
          {sidebarBusy ? (
            <div className="space-y-3 p-4">
              {[...Array(5)].map((_, idx) => (
                <div key={idx} className="flex items-center gap-4 rounded-2xl p-4 animate-pulse">
                  <div className="w-12 h-12 rounded-full bg-gray-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-32 rounded-full bg-gray-100" />
                    <div className="h-2.5 w-48 rounded-full bg-gray-100" />
                  </div>
                  <div className="h-5 w-5 rounded-full bg-gray-100" />
                </div>
              ))}
            </div>
          ) : filteredConversations.length > 0 ? (
            filteredConversations.map((conv: any) => (
              <div 
                key={conv.id}
                onClick={() => setActiveChat(conv.id)}
                className={`p-4 mx-2 my-1 rounded-2xl cursor-pointer transition-all flex items-center gap-4 group ${activeChat === conv.id ? 'bg-[#85A1D1]/10' : 'hover:bg-gray-50'}`}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden">
                    {conv.otherParticipant?.avatarUrl ? (
                      <img src={conv.otherParticipant.avatarUrl} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <User className="w-6 h-6" />
                    )}
                  </div>
                  {conv.otherParticipant?.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-bold text-gray-900 truncate">{conv.otherParticipant?.fullName || "User"}</span>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {conv.lastMessage ? format(new Date(conv.lastMessage.createdAt), "HH:mm") : ""}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'text-gray-900 font-bold' : 'text-gray-500 font-medium'}`}>
                      {conv.lastMessage?.content || "Start a conversation"}
                    </p>
                    {conv.unreadCount > 0 && (
                      <div className="w-5 h-5 bg-[#85A1D1] rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                        {conv.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 opacity-40">
              <MessageSquare className="w-12 h-12 mb-4" />
              <p className="text-sm font-bold text-center">No conversations found</p>
              <button 
                onClick={() => setNewChatModalOpen(true)}
                className="mt-4 px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-xs hover:bg-black transition-all"
              >
                Start First Chat
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main: Chat Window */}
      <div className={`flex-1 flex flex-col bg-gray-50/30 min-h-0 ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="h-20 bg-white border-b border-gray-50 px-4 sm:px-6 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <button onClick={() => setActiveChat(null)} className="md:hidden p-2 -ml-2 text-gray-400 hover:text-gray-900">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden">
                    {activeConversation?.otherParticipant?.avatarUrl ? (
                      <img src={activeConversation.otherParticipant.avatarUrl} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </div>
                  {activeConversation?.otherParticipant?.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{activeConversation?.otherParticipant?.fullName || "User"}</h3>
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                    {activeConversation?.otherParticipant?.isOnline ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2.5 text-gray-400 hover:text-[#85A1D1] hover:bg-[#85A1D1]/5 rounded-xl transition-all"><Info className="w-5 h-5" /></button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar min-h-0">
              {chatBusy ? (
                <div className="space-y-4 animate-pulse">
                  {[...Array(6)].map((_, idx) => (
                    <div key={idx} className={`flex ${idx % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[78%] rounded-2xl px-4 py-3 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#85A1D1]/10'}`}>
                        <div className="h-3.5 w-48 rounded-full bg-gray-100 mb-2" />
                        <div className="h-3 w-24 rounded-full bg-gray-100" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : messages.length > 0 ? messages.map((msg: any) => {
                const isMine = msg.senderId === adminUser?.id;
                return (
                  <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'} group relative`}>
                    <div className={`flex gap-3 max-w-[80%] ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className="flex flex-col gap-1 w-full">
                        {msg.isDeleted ? (
                          <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm italic text-gray-400 ${
                            isMine 
                              ? 'bg-gray-100 rounded-br-none' 
                              : 'bg-white text-gray-400 rounded-bl-none border border-gray-50'
                          }`}>
                            This message was deleted
                          </div>
                        ) : editingMessageId === msg.id ? (
                          <div className="flex flex-col gap-2 bg-white p-3 rounded-2xl border border-gray-200 shadow-sm min-w-[250px]">
                            {(editingAttachments.length > 0 || editingNewFiles.length > 0) && (
                              <div className="flex flex-wrap gap-2 mb-2">
                                {editingAttachments.map((url: string, idx: number) => {
                                  const isImage = url.match(/\.(jpeg|jpg|gif|png|webp)$/i) != null;
                                  return (
                                    <div key={`old-${idx}`} className="relative block max-w-[150px] rounded-lg border border-gray-200 pr-6">
                                      {isImage ? (
                                        <img src={url} alt="attachment" className="h-12 w-auto object-cover rounded-md" />
                                      ) : (
                                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg text-xs font-semibold">
                                          <FileText className="w-4 h-4" />
                                          <span>File {idx + 1}</span>
                                        </div>
                                      )}
                                      <button type="button" onClick={() => setEditingAttachments(prev => prev.filter((_, i) => i !== idx))} className="absolute right-1 top-1 bg-white/80 rounded-full p-0.5 hover:bg-gray-200 transition-colors">
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  );
                                })}
                                {editingNewFiles.map((file, idx) => (
                                    <div key={`new-${idx}`} className="relative flex items-center gap-2 bg-gray-100 p-2 rounded-lg pr-6">
                                      <FileText className="w-4 h-4 text-gray-500" />
                                      <span className="text-xs font-semibold max-w-[100px] truncate">{file.name}</span>
                                      <button type="button" onClick={() => setEditingNewFiles(prev => prev.filter((_, i) => i !== idx))} className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full transition-colors">
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                ))}
                              </div>
                            )}
                            <input 
                              type="text"
                              value={editingContent} 
                              onChange={(e) => setEditingContent(e.target.value)} 
                              className="text-sm bg-gray-50 border-gray-100 w-full outline-none px-2 py-1.5 rounded-lg focus:ring-1 focus:ring-blue-500/20"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveEdit(msg.id);
                                if (e.key === "Escape") setEditingMessageId(null);
                              }}
                            />
                            <div className="flex justify-between items-center gap-2 mt-1">
                              <div>
                                <input type="file" multiple ref={editFileInputRef} className="hidden" onChange={(e) => {
                                  if (e.target.files) {
                                    setEditingNewFiles(prev => [...prev, ...Array.from(e.target.files!)]);
                                  }
                                }} />
                                <button type="button" onClick={() => editFileInputRef.current?.click()} className="flex items-center text-gray-500 hover:text-gray-700 text-xs px-2 py-1 rounded-lg hover:bg-gray-50 transition-colors">
                                  <Paperclip className="w-3.5 h-3.5 mr-1" /> Add Files
                                </button>
                              </div>
                              <div className="flex gap-2">
                                <button type="button" onClick={() => setEditingMessageId(null)} className="text-xs px-3 py-1.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
                                <button type="button" disabled={isUploading || isUpdating} onClick={() => handleSaveEdit(msg.id)} className="text-xs px-3 py-1.5 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center disabled:opacity-50">
                                  {(isUploading || isUpdating) && editingMessageId === msg.id ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                                  Save
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                            isMine 
                              ? 'bg-[#85A1D1] text-white rounded-br-none' 
                              : 'bg-white text-gray-700 rounded-bl-none border border-gray-50'
                          }`}>
                            {msg.content !== " " && msg.content}
                            
                            {/* Attachments rendering */}
                            {msg.attachments && msg.attachments.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {msg.attachments.map((url: string, idx: number) => {
                                  const isImage = url.match(/\.(jpeg|jpg|gif|png|webp)$/i) != null;
                                  if (isImage) {
                                    return (
                                      <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="block max-w-[200px] overflow-hidden rounded-lg">
                                        <img src={url} alt="attachment" className="w-full h-auto object-cover" />
                                      </a>
                                    );
                                  }
                                  return (
                                    <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 p-2 rounded-lg text-xs font-semibold transition-colors ${isMine ? 'bg-black/10 hover:bg-black/20 text-white' : 'bg-black/5 hover:bg-black/10 text-gray-700'}`}>
                                      <FileText className="w-4 h-4" />
                                      <span>Attachment {idx + 1}</span>
                                    </a>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                        <span className={`text-[9px] font-bold text-gray-400 px-1 uppercase tracking-tighter flex gap-1 ${isMine ? 'justify-end' : 'justify-start'}`}>
                          {format(new Date(msg.createdAt), "HH:mm")}
                          {msg.isEdited && !msg.isDeleted && <span className="italic opacity-70">(edited)</span>}
                        </span>
                      </div>
                      
                      {isMine && !msg.isDeleted && editingMessageId !== msg.id && (
                        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity self-center">
                          <button onClick={() => { 
                            setEditingMessageId(msg.id); 
                            setEditingContent(msg.content === " " ? "" : msg.content); 
                            setEditingAttachments(msg.attachments || []);
                            setEditingNewFiles([]);
                          }} className="p-1.5 hover:bg-gray-100 rounded-md text-gray-400 hover:text-gray-600 bg-white shadow-sm border border-gray-100 transition-colors" title="Edit"><Edit2 className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDelete(msg.id)} disabled={isDeleting && deletingMessageId === msg.id} className="p-1.5 hover:bg-red-50 rounded-md text-gray-400 hover:text-red-500 bg-white shadow-sm border border-gray-100 transition-colors" title="Delete">
                            {isDeleting && deletingMessageId === msg.id ? <Loader2 className="w-3.5 h-3.5 animate-spin text-red-500" /> : <Trash2 className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }) : (
                <div className="h-full flex items-center justify-center text-center p-8">
                  <div className="max-w-sm space-y-2 text-gray-400">
                    <MessageSquare className="w-10 h-10 mx-auto opacity-40" />
                    <p className="text-sm font-semibold">No messages yet in this conversation.</p>
                  </div>
                </div>
              )}
              {otherUserTyping && (
                <div className="flex justify-start items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden shrink-0">
                    {activeConversation?.otherParticipant?.avatarUrl ? <img src={activeConversation.otherParticipant.avatarUrl} className="w-full h-full object-cover" alt="" /> : <User className="w-4 h-4" />}
                  </div>
                  <div className="bg-white px-4 py-2 rounded-2xl border border-gray-50 flex items-center gap-2">
                    <div className="flex gap-1">
                      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 bg-[#85A1D1] rounded-full" />
                      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 bg-[#85A1D1] rounded-full" />
                      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 bg-[#85A1D1] rounded-full" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Typing...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="flex flex-col bg-white border-t border-gray-50 shrink-0">
              {/* Preview Area */}
              {selectedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 p-4 pb-0 border-b border-gray-50">
                  {selectedFiles.map((file, idx) => (
                    <div key={idx} className="relative flex items-center gap-2 bg-gray-100 p-2 rounded-lg pr-8">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-xs font-semibold max-w-[150px] truncate">{file.name}</span>
                      <button 
                        type="button" 
                        onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== idx))}
                        className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <form onSubmit={handleSend} className="p-4 sm:p-6 flex items-end gap-3 bg-white">
                <div className="flex items-center bg-gray-50 p-2 rounded-2xl border border-gray-100 flex-1 focus-within:border-[#85A1D1]/30 transition-all">
                  <input 
                    type="file" 
                    multiple 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={(e) => {
                      if (e.target.files) {
                        setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <textarea 
                    value={messageText}
                    onChange={handleTyping}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    disabled={isSending || isUploading}
                    placeholder={isSending || isUploading ? "Sending..." : "Type a message..."}
                    className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-gray-900 py-2.5 px-3 resize-none max-h-32 disabled:opacity-50"
                    rows={1}
                  />
                </div>
                <button 
                  type="submit"
                  disabled={(!messageText.trim() && selectedFiles.length === 0) || isSending || isUploading}
                  className="p-3 bg-[#85A1D1] text-white rounded-2xl hover:bg-black transition-all shadow-lg shadow-[#85A1D1]/20 disabled:opacity-50 h-12 w-12 flex items-center justify-center shrink-0"
                >
                  {isSending || isUploading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5 ml-1" />
                  )}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="min-h-105 flex flex-col items-center justify-center p-8 sm:p-12 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300 mb-6">
              <MessageSquare className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Select a conversation</h3>
            <p className="text-sm text-gray-400 max-w-xs font-medium">Choose a conversation from the sidebar or start a new one to chat with your users.</p>
            <button 
              onClick={() => setNewChatModalOpen(true)}
              className="mt-6 px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold text-xs hover:bg-black transition-all shadow-xl shadow-gray-200 flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" /> Start New Chat
            </button>
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      <AnimatePresence>
        {newChatModalOpen && (
          <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setNewChatModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Start New Conversation</h3>
                <button onClick={() => setNewChatModalOpen(false)} className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6">
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    placeholder="Search users by name or email..." 
                    className="w-full h-12 bg-gray-50 border-none rounded-xl pl-11 pr-4 text-sm font-medium outline-none focus:ring-1 focus:ring-[#85A1D1] transition-all"
                  />
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
                  {userPickerBusy ? (
                    [...Array(5)].map((_, idx) => (
                      <div key={idx} className="p-4 rounded-2xl flex items-center gap-4 animate-pulse">
                        <div className="w-10 h-10 rounded-full bg-gray-100" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 w-36 rounded-full bg-gray-100" />
                          <div className="h-2.5 w-28 rounded-full bg-gray-100" />
                        </div>
                        <div className="h-5 w-10 rounded-full bg-gray-100" />
                      </div>
                    ))
                  ) : users.length > 0 ? (
                    users.map((user: any) => (
                      <div 
                        key={user.id}
                        onClick={() => handleStartConversation(user.id)}
                        className="p-4 rounded-2xl hover:bg-gray-50 cursor-pointer transition-all flex items-center gap-4 group"
                      >
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden">
                          {user.avatarUrl ? <img src={user.avatarUrl} className="w-full h-full object-cover" alt="" /> : <User className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#85A1D1] transition-colors">{user.fullName}</h4>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{user.email}</p>
                        </div>
                        <Badge className="bg-gray-100 text-gray-500 border-none text-[8px] font-black uppercase py-0.5">{user.role}</Badge>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center opacity-40">
                      <p className="text-sm font-bold">No users found</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return null; // Not needed in chat view
}
