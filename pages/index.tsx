import React, { FormEvent } from "react";
import signContext from "../context/AuthContext";
import styles from "../styles/Home.module.css";
export default function Home() {
  console.log('oi do home')
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const { isAuthenticated, signIn } = signContext();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const data = await signIn({ email, password });
    if (isAuthenticated) {
      
      console.log("foi authenticado", data)
    }
  }
  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <input type="email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" onChange={(e) => setPassword(e.target.value)} />

      <button type="submit">Entrar</button>
    </form>
  );
}
