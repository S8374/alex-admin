export interface UserProfileDrawerProps {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface DrawerHeaderProps {
  user: any;
}

export interface TabProps {
  user: any;
  isLoading?: boolean;
}
