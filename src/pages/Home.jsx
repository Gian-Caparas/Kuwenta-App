import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import CustomerRow from "../components/customers/CustomerRow";
import Header from "../components/ui/Header";
import Icon from "../components/ui/Icon";
import { useCustomers } from "../context/CustomersContext";
import { useProfile } from "../hooks/useProfile";
import { greeting, peso } from "../lib/format";
import { summarize } from "../lib/ledger";

export default function Home() {
  const navigate = useNavigate();
  const { customers, transactions } = useCustomers();
  const { storeName } = useProfile();

  const stats = useMemo(() => summarize(customers, transactions), [customers, transactions]);
  const biggest = useMemo(
    () => customers.filter((c) => c.balance > 0).sort((a, b) => b.balance - a.balance).slice(0, 3),
    [customers]
  );

  const net = stats.netThisMonth;

  return (
    <div>
      <Header
        title={greeting()}
        subtitle={storeName}
        right={
          <button type="button" className="icon-button notification" aria-label="Mga notification">
            <Icon name="bell" /><i />
          </button>
        }
      />
      <section className="content">
        <div className="balance-card">
          <div>
            <span>Kabuuang Utang</span>
            <strong>{peso(stats.total)}</strong>
            <small>
              {net === 0 ? (
                "Wala pang galaw ngayong buwan"
              ) : (
                <><span className="trend">{net > 0 ? "↑" : "↓"} {peso(Math.abs(net))}</span> ngayong buwan</>
              )}
            </small>
          </div>
          <div className="coin-stack" aria-hidden="true"><i /><i /><i /></div>
        </div>

        <div className="mini-grid">
          <div className="mini-card paid">
            <span className="mini-icon"><Icon name="check" size={18} /></span>
            <div><small>Nabayaran ngayong linggo</small><strong>{peso(stats.paidThisWeek)}</strong></div>
          </div>
          <div className="mini-card overdue">
            <span className="mini-icon"><Icon name="bell" size={18} /></span>
            <div><small>Lampas na sa due date</small><strong>{peso(stats.overdueTotal)}</strong></div>
          </div>
        </div>

        <div className="section-heading">
          <div><span className="eyebrow">Dapat bantayan</span><h2>Pinakamalaking balanse</h2></div>
          <button type="button" onClick={() => navigate("/customers")}>Tingnan lahat</button>
        </div>

        {biggest.length > 0 ? (
          <div className="list-card">
            {biggest.map((customer) => (
              <CustomerRow key={customer.id} customer={customer} onClick={() => navigate(`/customers/${customer.id}`)} />
            ))}
          </div>
        ) : (
          <div className="friendly-note">
            <div className="note-icon"><Icon name="users" /></div>
            <div>
              <strong>{customers.length ? "Walang may utang ngayon" : "Simulan na natin!"}</strong>
              <p>
                {customers.length
                  ? "Lahat ng suki mo ay bayad na. Ang galing!"
                  : "Magdagdag ng unang suki sa tab na Mga Suki, tapos itala ang unang utang."}
              </p>
            </div>
          </div>
        )}

        {stats.overdueCount > 0 && (
          <div className="friendly-note">
            <div className="note-icon"><Icon name="bell" /></div>
            <div>
              <strong>Magiliw na paalala</strong>
              <p>May {stats.overdueCount} suki na lampas na sa due date. Maaari kang magpadala ng paalala.</p>
            </div>
          </div>
        )}
      </section>

      <button
        type="button"
        className="fab"
        onClick={() => navigate(customers.length ? "/debt/select" : "/customers/new")}
      >
        <Icon name="plus" /><span>Bagong Utang</span>
      </button>
    </div>
  );
}
