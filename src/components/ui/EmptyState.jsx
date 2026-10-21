import Button from "./Button";
import Icon from "./Icon";

export default function EmptyState({ onAdd }) {
  return (
    <div className="empty-state">
      <div className="empty-illustration">
        <span /><span /><span />
        <div><Icon name="users" size={34} /></div>
      </div>
      <h2>Wala pang suki</h2>
      <p>Magdagdag ng una at simulan ang mas madaling pagtatala.</p>
      <Button onClick={onAdd} icon="plus" full={false}>Magdagdag ng suki</Button>
    </div>
  );
}
