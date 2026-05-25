"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

// API Hooks
import { 
  useGetActiveQuestionnaireQuery, 
  useInitQuestionnaireMutation, 
  useUpdateQuestionnaireMutation,
  useDeleteQuestionnaireMutation,
  useAddQuestionMutation, 
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
  useAddNestedQuestionMutation,
  useUpdateNestedQuestionMutation,
  useDeleteNestedQuestionMutation
} from "@/redux/api/QuestionnaireApi";

// Modular Components
import { ClipboardList } from "lucide-react";
import { LoadingState } from "../questionnaire/UIElements";
import { QuestionCard } from "../questionnaire/QuestionCard";
import { LogicStats } from "../questionnaire/LogicStats";
import { QuestionnaireModal } from "../questionnaire/QuestionnaireModal";
import { QuestionnaireHero } from "../questionnaire/QuestionnaireHero";
import { ManagementHeader } from "../questionnaire/ManagementHeader";

// --- Types ---
type ModalType = "init" | "edit-main" | "add-question" | "edit-question" | "add-nested" | "edit-nested";

interface FormData {
  topicTitle: string;
  description: string;
  disclaimerText: string;
  disclaimerLabel: string;
  questionText: string;
  category: string;
  isInputRequired: boolean;
  isDocumentNeeded: boolean;
  inputLebleText: string;
}

export function QuestionnaireManagementView() {
  const { data: response, isLoading, refetch } = useGetActiveQuestionnaireQuery(undefined);
  
  // API Mutations
  const [initQuestionnaire, { isLoading: isInitializing }] = useInitQuestionnaireMutation();
  const [updateQuestionnaire, { isLoading: isUpdatingMain }] = useUpdateQuestionnaireMutation();
  const [deleteQuestionnaire] = useDeleteQuestionnaireMutation();
  const [addQuestion, { isLoading: isAddingQuestion }] = useAddQuestionMutation();
  const [updateQuestion, { isLoading: isUpdatingQuestion }] = useUpdateQuestionMutation();
  const [deleteQuestion] = useDeleteQuestionMutation();
  const [addNestedQuestion, { isLoading: isAddingNested }] = useAddNestedQuestionMutation();
  const [updateNestedQuestion, { isLoading: isUpdatingNested }] = useUpdateNestedQuestionMutation();
  const [deleteNestedQuestion] = useDeleteNestedQuestionMutation();

  // State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>("init");
  const [selectedParentId, setSelectedParentId] = useState("");
  const [editId, setEditId] = useState("");
  const [formData, setFormData] = useState<FormData>({
    topicTitle: "",
    description: "",
    disclaimerText: "",
    disclaimerLabel: "",
    questionText: "",
    category: "HEALTH",
    isInputRequired: false,
    isDocumentNeeded: false,
    inputLebleText: ""
  });

  const questionnaire = response?.data;
  const questions = questionnaire?.questions || [];

  // --- Handlers ---
  const handleSave = async () => {
    try {
      if (modalType === "init" || modalType === "edit-main") {
        if (modalType === "edit-main" && questionnaire?.id) {
          await updateQuestionnaire({ id: questionnaire.id, topicTitle: formData.topicTitle, description: formData.description, disclaimerText: formData.disclaimerText, disclaimerLabel: formData.disclaimerLabel }).unwrap();
          toast.success("Framework updated");
        } else {
          await initQuestionnaire({ topicTitle: formData.topicTitle, description: formData.description, disclaimerText: formData.disclaimerText, disclaimerLabel: formData.disclaimerLabel }).unwrap();
          toast.success("Questionnaire initialized");
        }
      } else if (modalType === "add-question" || modalType === "edit-question") {
        if (modalType === "edit-question" && editId) {
          await updateQuestion({ id: editId, questionText: formData.questionText, category: formData.category, isInputRequired: formData.isInputRequired, isDocumentNeeded: formData.isDocumentNeeded }).unwrap();
          toast.success("Question updated");
        } else {
          await addQuestion({ questionnaireId: questionnaire.id, questionText: formData.questionText, category: formData.category, isInputRequired: formData.isInputRequired, isDocumentNeeded: formData.isDocumentNeeded }).unwrap();
          toast.success("Question added");
        }
      } else if (modalType === "add-nested" || modalType === "edit-nested") {
        if (modalType === "edit-nested" && editId) {
          await updateNestedQuestion({ id: editId, questionText: formData.questionText, inputLebleText: formData.inputLebleText, isInputRequired: formData.isInputRequired, isDocumentNeeded: formData.isDocumentNeeded }).unwrap();
          toast.success("Nested logic updated");
        } else {
          await addNestedQuestion({ questionId: selectedParentId, questionText: formData.questionText, inputLebleText: formData.inputLebleText, isInputRequired: formData.isInputRequired, isDocumentNeeded: formData.isDocumentNeeded }).unwrap();
          toast.success("Nested logic added");
        }
      }
      closeModal();
      refetch();
    } catch (error: any) {
      toast.error(error.data?.message || "Operation failed");
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ topicTitle: "", description: "", disclaimerText: "", disclaimerLabel: "", questionText: "", category: "HEALTH", isInputRequired: false, isDocumentNeeded: false, inputLebleText: "" });
    setEditId("");
    setSelectedParentId("");
  };

  const openModal = (type: ModalType, data?: any) => {
    setModalType(type);
    if (data) {
      if (type === "edit-main") {
        setFormData((prev: FormData) => ({ ...prev, topicTitle: data.topicTitle || "", description: data.description || "", disclaimerText: data.disclaimerText || "", disclaimerLabel: data.disclaimerLabel || "" }));
      } else if (type === "edit-question") {
        setEditId(data.id);
        setFormData((prev: FormData) => ({ ...prev, questionText: data.questionText, category: data.category, isInputRequired: data.isInputRequired, isDocumentNeeded: data.isDocumentNeeded }));
      } else if (type === "edit-nested") {
        setEditId(data.id);
        setFormData((prev: FormData) => ({ ...prev, questionText: data.questionText, inputLebleText: data.inputLabelText, isInputRequired: data.isInputRequired, isDocumentNeeded: data.isDocumentNeeded }));
      } else if (type === "add-nested") {
        setSelectedParentId(data.id);
      }
    } else {
      resetForm();
    }
    setModalOpen(true);
  };

  const handleDeleteMain = async () => {
    if (!confirm("CRITICAL: Delete entire framework?")) return;
    try {
      await deleteQuestionnaire(questionnaire.id).unwrap();
      toast.success("Framework removed");
      refetch();
    } catch (error) { toast.error("Delete failed"); }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm("Remove this question?")) return;
    try {
      await deleteQuestion(id).unwrap();
      toast.success("Question deleted");
    } catch (error) { toast.error("Delete failed"); }
  };

  const handleDeleteNested = async (id: string) => {
    if (!confirm("Remove logic branch?")) return;
    try {
      await deleteNestedQuestion(id).unwrap();
      toast.success("Logic branch removed");
    } catch (error) { toast.error("Delete failed"); }
  };

  if (isLoading) return <LoadingState />;

  return (
    <div className="mx-auto space-y-6 pb-20 relative">
      <ManagementHeader 
        hasQuestionnaire={!!questionnaire} 
        onInit={() => openModal("init")} 
        onAdd={() => openModal("add-question")} 
      />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        {!questionnaire ? (
          <div className="py-24 bg-white rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center text-center">
            <ClipboardList className="w-16 h-16 text-gray-100 mb-6" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Assessment</h3>
            <p className="text-sm text-gray-400 font-medium max-w-xs mb-8">Initialize the framework to start adding questions.</p>
            <button onClick={() => openModal("init")} className="h-11 px-8 bg-gray-900 text-white rounded-xl font-bold text-xs shadow-xl">Initialize Framework</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              <QuestionnaireHero 
                data={questionnaire} 
                onEdit={() => openModal("edit-main", questionnaire)} 
                onDelete={handleDeleteMain} 
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Assessment Flow ({questions.length})</h3>
                </div>
                {questions.map((q: any, idx: number) => (
                  <QuestionCard 
                    key={q.id}
                    idx={idx}
                    q={q}
                    onEdit={() => openModal("edit-question", q)}
                    onDelete={() => handleDeleteQuestion(q.id)}
                    onAddBranch={() => openModal("add-nested", q)}
                    onEditBranch={(nq: any) => openModal("edit-nested", nq)}
                    onDeleteBranch={handleDeleteNested}
                  />
                ))}
              </div>
            </div>

            <div className="lg:col-span-4">
              <LogicStats questions={questions} />
            </div>
          </div>
        )}
      </motion.div>

      <QuestionnaireModal 
        isOpen={modalOpen}
        type={modalType}
        formData={formData}
        setFormData={setFormData}
        onClose={closeModal}
        onSave={handleSave}
        isPending={isInitializing || isUpdatingMain || isAddingQuestion || isUpdatingQuestion || isAddingNested || isUpdatingNested}
      />
    </div>
  );
}
