import Head from "next/head";
import styles from '../styles/Home.module.css';
import { useState } from "react";

const tiers = [
    { floor: 0, ceil: 5.99, price: 0.9957 },
    { floor: 6, ceil: 15.99, price: 1.6189 },
    { floor: 16, ceil: 25, price: 3.2557 },
    { floor: 25.1, ceil: Infinity, price: 4.5407 },
];

const calculateBill = (consumption) => {
    const tier = tiers.filter(
        (t) => t.floor <= consumption && t.ceil > consumption
    )[0];

    return (consumption * tier.price).toFixed(2);
};

export default function Home() {
    const [total, setTotal] = useState(0);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const consumption = e.target.value;

        if (consumption) {
            if (isNaN(consumption)) {
                setTotal(0);
                setError("");
            } else {
                setTotal(calculateBill(consumption));
                setError("");
            }
        } else {
            setTotal(0);
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
                    {total > 0 &&
                        <>
                            <div>O teu consumo de àgua mensal foi de</div>
                            <div className={styles.finalPrice}>{total} €</div>
                            <div className={styles.disclaimer}>Os valores apresentados são respeitantes apenas ao consumo mensal de àgua e não ilustram o valor final da fatura</div>
                        </>

                    }
                </div>
                {error && <div style={{ color: "red" }}>{error}</div>}
            </div>
        </>
    );
}
