import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { markOnboarded } from "../auth/onboarding";
import Button from "../components/ui/Button";
import Icon from "../components/ui/Icon";
import { useTranslation } from "../hooks/useTranslation";

const slides = [
  { icon: "wallet", title: "onboarding.slide1.title", text: "onboarding.slide1.text" },
  { icon: "users", title: "onboarding.slide2.title", text: "onboarding.slide2.text" },
  { icon: "bell", title: "onboarding.slide3.title", text: "onboarding.slide3.text" },
];

export default function Onboarding() {
  const [slide, setSlide] = useState(0);
  const { session } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const finish = () => {
    if (session) markOnboarded(session.user.id);
    navigate("/", { replace: true });
  };

  return (
    <main className="onboarding">
      <div className="onboard-brand"><span className="brand-mark">K</span><span>Kuwenta</span></div>
      <div className="onboard-art">
        <div className="sun" />
        <div className="store-roof" />
        <div className="notebook"><Icon name={slides[slide].icon} size={48} /><i /><i /><i /></div>
      </div>
      <section className="onboard-copy" key={slide}>
        <span className="eyebrow">{t("onboarding.easierStore")}</span>
        <h1>{t(slides[slide].title)}</h1>
        <p>{t(slides[slide].text)}</p>
      </section>
      <div className="dots">
        {slides.map((_, index) => <span key={index} className={index === slide ? "active" : ""} />)}
      </div>
      <Button onClick={() => (slide < 2 ? setSlide(slide + 1) : finish())}>
        {slide === 2 ? t("onboarding.start") : t("onboarding.next")}
      </Button>
      {slide < 2 && <button type="button" className="skip" onClick={finish}>{t("onboarding.skip")}</button>}
    </main>
  );
}