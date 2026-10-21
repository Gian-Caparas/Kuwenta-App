import { useNavigate } from "react-router-dom";
import Avatar from "../components/ui/Avatar";
import Button from "../components/ui/Button";
import Header from "../components/ui/Header";
import { useCustomer } from "../hooks/useCustomer";
import { peso, shortDate, timeOfDay } from "../lib/format";

const HISTORY_LIMIT = 30;

export default function CustomerDetail() {
  const customer = useCustomer();
  const navigate = useNavigate();
  const base = `/customers/${customer.id}`;
  const history = customer.transactions.slice(0, HISTORY_LIMIT);

  return (
    <div>
      <Header title="Detalye ng suki" back={() => navigate("/customers")} />
      <section className="content">
        <div className="customer-hero">
          <Avatar name={customer.name} large />
          <div><h2>{customer.name}</h2><span>{customer.phone || "Walang numero"}</span></div>
          <div className="hero-balance">
            <small>Kasalukuyang balanse</small>
            <strong>{peso(customer.balance)}</strong>
          </div>
        </div>

        <div className="action-grid">
          <Button onClick={() => navigate(`${base}/debt`)} icon="plus">Dagdag Utang</Button>
          <Button
            onClick={() => navigate(`${base}/payment`)}
            icon="wallet"
            variant="secondary"
            disabled={customer.balance <= 0}
          >
            Tanggap Bayad
          </Button>
        </div>

        <div className="section-heading">
          <div><span className="eyebrow">Aktibidad</span><h2>Kasaysayan</h2></div>
        </div>

        {history.length > 0 ? (
          <div className="timeline">
            {history.map((t) => (
              <div className={`transaction ${t.type}`} key={t.id}>
                <span className="timeline-dot" />
                <div>
                  <strong>{t.type === "debt" ? "Utang" : "Bayad"}</strong>
                  <p>{t.note || (t.type === "debt" ? "Walang note" : "Cash payment")}</p>
                  <small>{shortDate(t.created_at)} • {timeOfDay(t.created_at)}</small>
                </div>
                <b>{t.type === "debt" ? "+" : "−"} {peso(Number(t.amount))}</b>
              </div>
            ))}
          </div>
        ) : (
          <div className="friendly-note">
            <div className="note-icon"><Avatar name={customer.name} /></div>
            <div>
              <strong>Wala pang kasaysayan</strong>
              <p>Itala ang unang utang ni {customer.name} para magsimula.</p>
            </div>
          </div>
        )}

        {customer.balance > 0 && (
          <Button variant="ghost" icon="bell" onClick={() => navigate(`${base}/reminder`)}>
            Magpadala ng Paalala
          </Button>
        )}
      </section>
    </div>
  );
}
