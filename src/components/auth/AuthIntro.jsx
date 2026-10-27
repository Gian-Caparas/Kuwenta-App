import Icon from "../ui/Icon";
import { useTranslation } from "../../hooks/useTranslation";

export default function AuthIntro() {
  const { t } = useTranslation();
  return (
    <section className="auth-intro">
      <div className="auth-brand"><span className="brand-mark">K</span><span>Kuewenta</span></div>
      <div className="auth-message">
        <span className="eyebrow">{t("auth.welcome")}</span>
        <h1>{t("onboarding.slide1.title")}, {t("onboarding.slide2.title").toLowerCase()}.</h1>
        <p>{t("onboarding.desc")}</p>
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