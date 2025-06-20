"use client";
export const dynamic = 'force-dynamic';

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface PaymentDetail {
  invoice_id: string;
  name: string;
  surname: string;
  bill_address1: string;
  bill_address2: string;
  bill_city: string;
  bill_postcode: string;
  bill_state: string;
  bill_country: string;
  bill_email: string;
  bill_phone: string;
  total: string;
  status: number;
  createdAt: string;
  payment_status?: number;
  transaction_type?: string;
  [key: string]: any;
}

function PaymentSuccessInner() {
  const searchParams = useSearchParams();
  const invoice_id = searchParams.get("invoice_id");
  const status = searchParams.get("status");
  const transaction_type = searchParams.get("transaction_type");
  const [detail, setDetail] = useState<PaymentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmingPayment, setConfirmingPayment] = useState(false);

  useEffect(() => {
    if (!invoice_id) return;
    setLoading(true);
    fetch(`/api/sipay-payment-detail?invoice_id=${invoice_id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Kayıt bulunamadı");
        return res.json();
      })
      .then(async (data) => {
        console.log("Payment detail from DB:", data);
        console.log("URL status:", status);
        console.log("DB status:", data.status);
        setDetail(data);
        setError("");

        // Check if this is a Pre-Authorization case using URL parameters
        console.log("Status:", status, "Transaction Type:", transaction_type);
        if (status === "1" && transaction_type === "Pre-Authorization") {
          setConfirmingPayment(true);
          try {
            // Get token first
            const tokenRes = await fetch('/api/sipay-token', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              }
            });
            
            const tokenData = await tokenRes.json();
            console.log("Token response:", tokenData);

            if (tokenData.status_code === 100 && tokenData.data?.token) {
              const token = tokenData.data.token;
              console.log("Token received:", token);

              // Call confirmPayment API
              const confirmRes = await fetch('/api/sipay-confirmPayment', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  invoice_id: invoice_id,
                  status: 1,
                  total: data.total
                })
              });

              if (!confirmRes.ok) {
                throw new Error("Ödeme onaylanamadı");
              }

              const confirmData = await confirmRes.json();
              console.log("Payment confirmed:", confirmData);

              if (confirmData.status_code === 100) {
                console.log("Payment successfully confirmed");
                
                // Update status in database
                try {
                  const updateRes = await fetch('/api/sipay-update-status', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      invoice_id: invoice_id,
                      status: 1
                    })
                  });

                  if (!updateRes.ok) {
                    throw new Error("Veritabanı güncellenemedi");
                  }

                  // Update the payment status in the UI
                  setDetail(prev => prev ? {
                    ...prev,
                    status: 1,
                    transaction_status: confirmData.transaction_status
                  } : null);
                } catch (dbError) {
                  console.error("Database update error:", dbError);
                  throw new Error("Veritabanı güncellenirken bir hata oluştu");
                }
              } else {
                throw new Error(confirmData.status_description || "Ödeme onaylanamadı");
              }
            } else {
              throw new Error(tokenData.status_description || "Token alınamadı");
            }
          } catch (err: any) {
            console.error("Payment confirmation error:", err);
            setError(err.message || "Ödeme onaylanırken bir hata oluştu");
          } finally {
            setConfirmingPayment(false);
          }
        }
      })
      .catch((err) => {
        setError(err.message || "Bir hata oluştu");
        setDetail(null);
      })
      .finally(() => setLoading(false));
  }, [invoice_id, status, transaction_type]);

  return (
    <div style={{ minHeight: "100vh", background: "#eaf0fa", padding: "20px" }}>
      <div
        style={{
          maxWidth: 900,
          margin: "20px auto",
          background: "#fff",
          borderRadius: 24,
          boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Sol taraf */}
        <div style={{ padding: "20px", borderBottom: "1px solid #f0f0f0" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ marginBottom: 16 }}>
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="56" height="56" rx="16" fill="#E6F4EA" />
                <path d="M28 16L36 24H32V36H24V24H20L28 16Z" fill="#34A853" />
              </svg>
            </div>
            <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 8 }}>Ödeme Başarılı</h2>
            <div style={{ color: "#888", fontSize: 16 }}>Siparişiniz alınmıştır.</div>
            {detail && (
              <div style={{ fontSize: 32, fontWeight: 600, margin: "24px 0 0 0", color: "#222" }}>
                ₺ {detail.total}
              </div>
            )}
            {confirmingPayment && (
              <div style={{ marginTop: 16, color: "#666" }}>
                Ödeme onaylanıyor...
              </div>
            )}
          </div>
          <div style={{ background: "#f7fafd", borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 12 }}>Sipariş Özeti</div>
            {loading && <div>Yükleniyor...</div>}
            {error && <div style={{ color: "red" }}>{error}</div>}
            {detail && (
              <table style={{ width: "100%", fontSize: 15 }}>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 500, padding: "6px 0" }}>Sipariş No</td>
                    <td>{detail.invoice_id}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 500, padding: "6px 0" }}>Ad Soyad</td>
                    <td>{detail.name} {detail.surname}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 500, padding: "6px 0" }}>Adres</td>
                    <td>
                      {detail.bill_address1}
                      {detail.bill_address2 && <><br />{detail.bill_address2}</>}
                      <br />{detail.bill_city}, {detail.bill_state} {detail.bill_postcode}
                      <br />{detail.bill_country}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 500, padding: "6px 0" }}>Telefon</td>
                    <td>{detail.bill_phone}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 500, padding: "6px 0" }}>E-posta</td>
                    <td>{detail.bill_email}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 500, padding: "6px 0" }}>Tutar</td>
                    <td>₺ {detail.total}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 500, padding: "6px 0" }}>Durum</td>
                    <td>{detail.status === 1 ? "Ödendi" : "Bekliyor"}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 500, padding: "6px 0" }}>Tarih</td>
                    <td>{new Date(detail.createdAt).toLocaleString("tr-TR")}</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
          <a href="/" style={{ display: "block", width: "100%", textAlign: "center", background: "#34A853", color: "#fff", borderRadius: 8, padding: "14px 0", fontWeight: 600, fontSize: 18, textDecoration: "none" }}>
            Ana Sayfaya Dön
          </a>
        </div>
        {/* Sağ taraf */}
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ marginBottom: 16 }}>
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="56" height="56" rx="16" fill="#E6F4EA" />
                <path d="M16 28H40V32C40 34.2091 38.2091 36 36 36H20C17.7909 36 16 34.2091 16 32V28Z" fill="#34A853" />
                <rect x="20" y="20" width="16" height="8" rx="4" fill="#34A853" />
              </svg>
            </div>
            <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 12, color: '#222' }}>Teşekkürler!</div>
            <div style={{ color: "#555", fontSize: 16, marginBottom: 16 }}>
              Siparişiniz başarıyla alınmıştır. En kısa sürede size ulaşacağız.<br />
              Bizi tercih ettiğiniz için teşekkür ederiz.<br />
              Sorularınız için <a href="/contact" style={{ color: '#34A853', textDecoration: 'underline' }}>iletişim</a> sayfamızdan bize ulaşabilirsiniz.
            </div>
            <div style={{ marginTop: 32, color: "#34A853", fontWeight: 700, fontSize: 18 }}>kilometre<span style={{ fontWeight: 400, fontSize: 14, marginLeft: 4 }}>HACKER</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <PaymentSuccessInner />
    </Suspense>
  );
} 