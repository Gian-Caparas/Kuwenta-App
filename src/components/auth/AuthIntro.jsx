import Icon from "../ui/Icon";

export default function AuthIntro() {
  return (
    <section className="auth-intro">
      <div className="auth-brand"><span className="brand-mark">K</span><span>Kuewenta</span></div>
      <div className="auth-message">
        <span className="eyebrow">Kasangga ng tindahan mo</span>
        <h1>Itala ang bawat utang, may tiwala.</h1>
        <p>Ang digital na listahan ng utang para sa tindahan mo.</p>
      </div>
      <div className="auth-illustration" aria-hidden="true">
        <div className="auth-sun" />
        <div className="mini-store"><i /><i /><i /><span>K</span></div>
        <div className="auth-list"><Icon name="check" size={18} /><b /><b /><b /></div>
      </div>
      <div className="auth-weave" aria-hidden="true" />
    </section>
  );
}
