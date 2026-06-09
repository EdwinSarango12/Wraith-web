import { useState, useEffect } from "react";
import storeDonations from "../../context/storeDonations";
import { useStripe, CardElement, useElements } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';

function ModalPayment({ descripcion }) {
    const { toggleModal, payDonation } = storeDonations();
    const stripe = useStripe();
    const elements = useElements();

    const [monto, setMonto] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePayment = async (e) => {
        e.preventDefault();

        const parsedMonto = parseFloat(monto);
        if (isNaN(parsedMonto) || parsedMonto <= 0) {
            alert("Por favor, ingresa un monto válido.");
            return;
        }

        if (!stripe || !elements) {
            toast.error("Stripe no está disponible. Verifica la configuración del servidor.");
            setLoading(false);
            return;
        }

        setLoading(true);

        const cardElement = elements.getElement(CardElement);
        const { paymentMethod, error } = await stripe.createPaymentMethod({
            type: "card",
            card: cardElement,
        });

        if (error) {
            console.error(error);
            setLoading(false);
            return;
        }

        const amountInCents = Math.round(parsedMonto * 100);
        const data = {
            paymentMethodId: paymentMethod.id,
            cantidad: amountInCents,
            motivo: descripcion || "Donación",
        };

        try {
            await payDonation(data);
        } catch (error) {
            console.error("Error al procesar donación:", error);
            toast.error(error?.response?.data?.msg || "Error al procesar la donación.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const link = document.createElement("link");
        link.href = "https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&family=Roboto:wght@400;500;700&display=swap";
        link.rel = "stylesheet";
        document.head.appendChild(link);
        return () => { document.head.removeChild(link); };
    }, []);

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
        >
            <div
                className="relative w-full max-w-md mx-4 rounded-xl overflow-hidden"
                style={{
                    background: 'linear-gradient(180deg, rgba(26,26,26,0.98), rgba(10,10,10,0.98))',
                    border: '1px solid rgba(255,255,255,0.12)',
                    boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5), 0 20px 60px rgba(0,0,0,0.8)',
                    fontFamily: 'Roboto, sans-serif',
                    animation: 'mpIn .25s ease',
                }}
            >
                <style>{`
                    @keyframes mpIn {
                        from { opacity: 0; transform: translateY(14px) scale(0.97); }
                        to   { opacity: 1; transform: translateY(0) scale(1); }
                    }
                    .mp-input {
                        width: 100%;
                        padding: 8px 12px;
                        background: rgba(8,8,8,0.88);
                        border: 1px solid rgba(255,255,255,0.12);
                        border-radius: 6px;
                        color: #f2f2f2;
                        font-family: 'Roboto', sans-serif;
                        font-size: 14px;
                        outline: none;
                        transition: border-color .2s ease, box-shadow .2s ease;
                    }
                    .mp-input:focus {
                        border-color: rgba(255,255,255,0.45);
                        box-shadow: 0 0 0 3px rgba(255,255,255,0.07);
                    }
                    .mp-btn {
                        display: inline-flex; align-items: center; justify-content: center;
                        font-family: 'Press Start 2P', monospace;
                        font-size: 0.52rem; line-height: 1; text-transform: uppercase;
                        padding: 0.75rem 1rem; border-radius: 5px;
                        min-height: 42px; cursor: pointer; flex: 1;
                        transition: transform .1s ease, box-shadow .15s ease, border-color .15s ease;
                    }
                    .mp-btn-pay {
                        background: #141414; color: #d0d0d0;
                        border: 2px solid rgba(255,255,255,0.18);
                        box-shadow: 3px 3px 0 #000;
                    }
                    .mp-btn-pay:hover:not(:disabled) {
                        background: #1c1c1c;
                        border-color: rgba(255,255,255,0.38);
                        transform: translate(-1px,-1px);
                        box-shadow: 5px 5px 0 #000;
                    }
                    .mp-btn-pay:disabled { opacity: 0.4; cursor: not-allowed; }
                    .mp-btn-cancel {
                        background: rgba(40,5,5,0.85); color: #fca5a5;
                        border: 2px solid rgba(220,38,38,0.45);
                        box-shadow: 3px 3px 0 #000;
                    }
                    .mp-btn-cancel:hover {
                        background: rgba(60,10,10,0.90);
                        border-color: rgba(220,38,38,0.7);
                        transform: translate(-1px,-1px);
                        box-shadow: 5px 5px 0 #000;
                    }
                    .mp-btn:active { transform: translate(2px,2px); box-shadow: 1px 1px 0 #000; }
                    .mp-btn:focus-visible { outline: 3px solid #888; outline-offset: 3px; }
                    .mp-label {
                        display: block;
                        font-family: 'VT323', monospace;
                        font-size: 1rem;
                        letter-spacing: 0.1em;
                        text-transform: uppercase;
                        color: #8a8a8a;
                        margin-bottom: 6px;
                    }
                `}</style>

                {/* Header */}
                <div
                    className="px-6 pt-5 pb-4"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.09)' }}
                >
                    <p
                        className="text-white font-bold tracking-wide"
                        style={{ fontFamily: 'Press Start 2P, monospace', fontSize: '0.75rem' }}
                    >
                        REALIZAR DONACIÓN
                    </p>
                    <p className="mt-1" style={{ fontFamily: 'VT323, monospace', fontSize: '1rem', color: '#6b6b6b', letterSpacing: '0.05em' }}>
                        Procesado de forma segura vía Stripe
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handlePayment} className="px-6 py-5 space-y-5">
                    <div>
                        <label className="mp-label">Descripción</label>
                        <p
                            className="text-slate-300 px-3 py-2 rounded-md text-sm"
                            style={{ background: 'rgba(8,8,8,0.88)', border: '1px solid rgba(255,255,255,0.09)', fontFamily: 'Roboto, sans-serif' }}
                        >
                            {descripcion}
                        </p>
                    </div>

                    <div>
                        <label className="mp-label">Monto (USD)</label>
                        <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={monto}
                            onChange={(e) => setMonto(e.target.value)}
                            placeholder="0.00"
                            className="mp-input"
                        />
                    </div>

                    <div>
                        <label className="mp-label">Tarjeta de crédito</label>
                        <div
                            className="px-3 py-3 rounded-md"
                            style={{ background: 'rgba(8,8,8,0.88)', border: '1px solid rgba(255,255,255,0.12)' }}
                        >
                            <CardElement options={{ style: { base: { fontSize: '15px', color: '#e5e7eb', '::placeholder': { color: '#4b5563' } } } }} />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-1">
                        <button type="submit" disabled={loading} className="mp-btn mp-btn-pay">
                            {loading ? "Procesando..." : "Pagar"}
                        </button>
                        <button type="button" onClick={() => toggleModal()} className="mp-btn mp-btn-cancel">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ModalPayment;
