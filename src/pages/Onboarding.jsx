import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { markOnboarded } from "../auth/onboarding";
import Button from "../components/ui/Button";
import Icon from "../components/ui/Icon";

const slides = [
  { icon: "wallet", title: "Itala ang bawat utang", text: "Mabilis at malinaw—hindi na kailangang maghanap sa lumang kuwaderno." },
  { icon: "users", title: "Alamin kung sino ang may balanse", text: "Makikita agad ang may utang, bayad na, at lampas sa takdang araw." },
  { icon: "bell", title: "Singilin nang magalang", text: "Magpadala ng magiliw na paalala sa SMS o Messenger." },
];

export default function Onboarding() {
  const [slide, setSlide] = useState(0);
  const { session } = useAuth();
  const navigate = useNavigate();

  const finish = () => {
    if (session) markOnboarded(session.user.id);
    navigate("/", { replace: true });
  };

  return (
    <main className="onboarding">
      <div className="onboard-brand"><span className="brand-mark">K</span><span>Kuewenta</span></div>
      <div className="onboard-art">
        <div className="sun" />
        <div className="store-roof" />
        <div className="notebook"><Icon name={slides[slide].icon} size={48} /><i /><i /><i /></div>
      </div>
      <section className="onboard-copy" key={slide}>
        <span className="eyebrow">Mas madaling tindahan</span>
        <h1>{slides[slide].title}</h1>
        <p>{slides[slide].text}</p>
      </section>
      <div className="dots">
        {slides.map((_, index) => <span key={index} className={index === slide ? "active" : ""} />)}
      </div>
      <Button onClick={() => (slide < 2 ? setSlide(slide + 1) : finish())}>
        {slide === 2 ? "Simulan" : "Susunod"}
      </Button>
      {slide < 2 && <button type="button" className="skip" onClick={finish}>Laktawan</button>}
    </main>
  );
}
