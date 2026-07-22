import RecruitmentShell from "../../../components/dashboard/recruitment/RecruitmentShell";

interface Props {
  onLogout: () => void;
  onSwitch: () => void;
}

export default function RecruiterDashboard({ onLogout, onSwitch }: Props) {
  return (
    <RecruitmentShell
      role="recruiter"
      onLogout={onLogout}
      onSwitchRole={() => onSwitch()}
    />
  );
}
