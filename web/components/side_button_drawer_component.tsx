import "../public/sidebar.css"

interface SideDrawerProps {
  open: boolean;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({ open }) => {
  return (
    <div className={`sidebar ${open ?"open" : ""}`}>
      <p>Sidebar content goes here</p>
    </div>
  );
};
