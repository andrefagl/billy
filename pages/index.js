import Head from "next/head";
import styles from '../styles/Home.module.css';
import { useState } from "react";

const tiers = [
    { max: 6, price: 0.9957 },
    { max: 11, price: 1.6189 },
    { max: 11, price: 3.2557 },
    { max: Infinity, price: 4.5407 }
];

const taxes = {
    vat: 0.06,
    fixedDailyTax: 0.3011,
    hydricResourcesTax: 0.0361
}

const calculateBill = (consumption) => {

    let currentConsumption = consumption;

    const reducer = (acc, current) => {
        const {max, price} = current;
        if (currentConsumption > max) {
            acc = acc + (max * price);
            currentConsumption = currentConsumption - max;
        } else {
            acc = acc + (currentConsumption * price)
            currentConsumption = 0;
        } 
        return acc;
    }
    
    const totalWaterPrice = tiers.reduce(reducer, 0);
    const totalFixedDailyTax = taxes.fixedDailyTax * 30;
    const totalHydricResourcesTax = taxes.hydricResourcesTax * consumption;
    const subtotal = totalWaterPrice + totalFixedDailyTax + totalHydricResourcesTax;
    const totalVat = subtotal * taxes.vat;
    const total = subtotal + totalVat;
    return {
        total: total.toFixed(2),
        water: totalWaterPrice.toFixed(2),
        taxes: {
            fixedDailyTax: totalFixedDailyTax.toFixed(2),
            vat: totalVat.toFixed(2),
            hydricResourcesTax: totalHydricResourcesTax.toFixed(2),
        }
    }
};

export default function Home() {
    const [totals, setTotals] = useState({total: 0, water: 0});
    const [taxes, setTaxes] = useState({
        vat: 0,
        fixedDailyTax: 0,
        hydricResourcesTax: 0
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const consumption = e.target.value;

        if (consumption) {
            if (isNaN(consumption)) {
                setTotals({total: 0, water: 0});
                setError("");
            } else {
                const bill = calculateBill(consumption);
                setTotals({total: bill.total, water: bill.water});
                setTaxes(bill.taxes);
                setError("");
            }
        } else {
            setTotals({total: 0, water: 0});
            setError("");
        }
    };

    return (
        <>
            <Head>
                <title>
                    Billy
                </title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <nav className={styles.navbar}>

            </nav>

            <section className={styles.logoContainer}>
                <img className={styles.logo} src="Billy.svg" />
            </section>

            <div className={styles.calculator}>
                <input type="number" min="0" className={styles.calculatorInput} placeholder="Consumo mensal (m3)" onChange={handleChange} />
                <div className={styles.resultMessage}>
                    {totals.total > 0 &&
                        <>
                            <div>
                                <div>O teu consumo de àgua mensal foi de</div>
                                <div className={styles.finalPrice}>{totals.total} €</div>
                                <div className={styles.priceDetails}>
                                    <div className={styles.priceRow}>
                                        <div className={styles.priceLabel}>
                                            Água
                                        </div>
                                        <div className={styles.priceValue}>
                                            { totals.water } €
                                        </div>
                                    </div>
                                    <div className={styles.priceRow}>
                                        <div className={styles.priceLabel}>
                                            Taxa fixa de àgua
                                        </div>
                                        <div className={styles.priceValue}>
                                            { taxes.fixedDailyTax } €
                                        </div>
                                    </div>
                                    <div className={styles.priceRow}>
                                        <div className={styles.priceLabel}>
                                            Recursos Hidricos
                                        </div>
                                        <div className={styles.priceValue}>
                                            { taxes.hydricResourcesTax } €
                                        </div>
                                    </div>
                                    <div className={styles.priceRow}>
                                        <div className={styles.priceLabel}>
                                            Iva (6%)
                                        </div>
                                        <div className={styles.priceValue}>
                                            { taxes.vat } €
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.disclaimer}>Os valores apresentados são aproximados e podem não refletir os valores exactos da fatura</div>
                            </div>
                        </>
                    }
                </div>
                {error && <div style={{ color: "red" }}>{error}</div>}
            </div>
        </>
    );
}
