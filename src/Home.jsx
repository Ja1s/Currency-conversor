import { useState, useEffect } from 'react';
import './Home.css';

function Home() {
  const [result, setResult] = useState('');
  const [currencyFrom, setCurrencyFrom] = useState('');
  const [currencyTo, setCurrencyTo] = useState('');
  const [amount, setAmount] = useState('');
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    async function fetchCurrencies() {
      try {
        const res = await fetch('https://api.frankfurter.app/currencies');
        if (!res.ok) {
          throw new Error(`Erro: ${res.status}`);
        }
        const data = await res.json();
        const currencyList = Object.keys(data).map(key => ({ code: key, name: data[key] }));
        setCurrencies(currencyList);
        setCurrencyFrom(currencyList[0]?.code || '');
        setCurrencyTo(currencyList[1]?.code || '');
      } catch (error) {
        console.error('Erro ao buscar lista de moedas da API', error);
      }
    }

    fetchCurrencies();
  }, []);

  useEffect(() => {
    async function getValues() {
      try {
        const res = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${currencyFrom}&to=${currencyTo}`);
        if (!res.ok) {
          throw new Error(`Erro: ${res.status}`);
        }
        const data = await res.json();

        if (data.rates && data.rates[currencyTo]) {
          setResult(data.rates[currencyTo]);
        } else {
          setResult(0);
        }
      } catch (error) {
        console.error('Erro ao buscar dados da API', error);
        setResult(0);
      }
    }

    if (amount > 0 && currencyFrom && currencyTo) {
      getValues();
    }
  }, [currencyFrom, currencyTo, amount]);

  return (
    <div className="Home">
      <div className="box">
        <div className='transition-area'>
          <div className='from'>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
            <select
              name="currency-1"
              id="currency-1"
              value={currencyFrom}
              onChange={(e) => setCurrencyFrom(e.target.value)}
            >
              {currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  <span className="option-container">
                    {(currency.code)} {currency.name}
                  </span>
                </option>
              ))}
            </select>
          </div>

          <div className='to'>
            <p>{result}</p>
            <select
              name="currency-2"
              id="currency-2"
              value={currencyTo}
              onChange={(e) => setCurrencyTo(e.target.value)}
            >
              {currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  <span className="option-container">
                    {(currency.code)} {currency.name}
                  </span>
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
