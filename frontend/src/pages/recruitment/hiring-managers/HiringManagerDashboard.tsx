import RecruitmentShell from "../../../components/dashboard/recruitment/RecruitmentShell";

interface Props {
  onLogout: () => void;
  onSwitch: () => void;
}

export default function HiringManagerDashboard({ onLogout, onSwitch }: Props) {
  return (
    <RecruitmentShell
      role="hiring_manager"
      onLogout={onLogout}
      onSwitchRole={() => onSwitch()}
    />
  );
}
