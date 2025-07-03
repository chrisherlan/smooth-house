import React, { useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import "./App.css";
import logoSmooth  from "../public/logo-smooth.png"

function App() {
  const [form, setForm] = useState({
    alumno: "",
    curso: "",
    tipoCurso: "",
    mes: "",
    monto: "",
  });

  const [generando, setGenerando] = useState(false);
  const [mostrarTicket, setMostrarTicket] = useState(false);
  const [fecha, setFecha] = useState(() => {
    const hoy = new Date();
    return hoy.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  });

  const ticketRef = useRef(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      alumno: "",
      curso: "",
      tipoCurso: "",
      mes: "",
      monto: "",
    });

    // Opcional: refrescar fecha también
    setFecha(
      new Date().toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    );
  };


  const handlePrint = () => {
  setGenerando(true);
  setMostrarTicket(true);

  setTimeout(() => {
    if (ticketRef.current) {
      const printWindow = window.open("", "_blank");

      const style = `
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .ticket { border: 1px dashed #000; padding: 20px; width: 300px; margin: auto; }
          .ticket h2 { text-align: center; margin-bottom: 20px; }
          .ticket p { margin: 5px 0; }
          img { display: block; margin: 0 auto; max-width: 80px; }
        </style>
      `;

      const content = ticketRef.current.innerHTML;

      printWindow.document.write(`
        <html>
          <head>
            <title>Ticket de Pago - Smooth House</title>
            ${style}
          </head>
          <body>
            <div class="ticket">
              ${content}
            </div>
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              };
            </script>
          </body>
        </html>
      `);

      printWindow.document.close();
      setTimeout(() => {
        setGenerando(false);
        setMostrarTicket(false);
        resetForm();
      }, 500); // da tiempo para que cargue
    }
  }, 100);
};
  const handleDownloadPDF = () => {
    setGenerando(true);
    setMostrarTicket(true);

    setTimeout(() => {
      if (ticketRef.current) {
        html2pdf()
          .set({
            margin: 10,
            filename: `ticket-${form.alumno}-${form.mes}.pdf`,
            html2canvas: { scale: 2 },
            jsPDF: { unit: "mm", format: "a7", orientation: "portrait" },
          })
          .from(ticketRef.current)
          .save()
          .then(() => {
            setGenerando(false);
            setMostrarTicket(false);
            resetForm();
          });
      }
    }, 100);
  };
  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", fontFamily: "Arial" }}>
      <img src={logoSmooth} />
      <h3>Smooth House - Formulario de Pago</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handlePrint();
        }}
      >
        <div>
          <label>Nombre del alumno:</label>
          <input
            type="text"
            name="alumno"
            value={form.alumno}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Curso:</label>
          <input
            type="text"
            name="curso"
            value={form.curso}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Tipo de curso:</label>
          <input
            type="text"
            name="tipoCurso"
            value={form.tipoCurso}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Mes a pagar:</label>
          <input
            type="text"
            name="mes"
            value={form.mes}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Monto a pagar:</label>
          <input
            type="text"
            name="monto"
            value={form.monto}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Imprimir Ticket</button>
        <button type="button" onClick={handleDownloadPDF} style={{ marginLeft: "10px" }}>
          Descargar PDF
        </button>
      </form>

      {/* Ticket oculto para impresión y PDF */}
      {mostrarTicket && (
        <div
          ref={ticketRef}
          style={{
            position: "absolute",
            left: "-9999px",
            top: 0,
          }}
        >

          <div
            style={{
              border: "1px dashed #000",
              padding: "20px",
              width: "300px",
              fontFamily: "Arial",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
              <img src={logoSmooth} alt="Smooth House Logo" style={{ maxWidth: "80px" }} />
              <h2 style={{ margin: "10px 0 0" }}>SMOOTH HOUSE</h2>
            </div>
            <p><strong>Fecha:</strong> {fecha}</p>
            <p><strong>Alumno:</strong> {form.alumno}</p>
            <p><strong>Curso:</strong> {form.curso}</p>
            <p><strong>Tipo:</strong> {form.tipoCurso}</p>
            <p><strong>Mes pagado:</strong> {form.mes}</p>
            <p><strong>Monto:</strong> ${form.monto}</p>
            <p style={{ textAlign: "center", marginTop: "1rem" }}>
              ¡Gracias por su pago 🎵!
            </p>
          </div>
        </div>
      )}
      {generando && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            fontSize: "1.5rem",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#222",
              padding: "2rem",
              borderRadius: "10px",
              boxShadow: "0 0 10px #000",
            }}
          >
            🎶 Generando ticket...
          </div>
        </div>
      )}
    </div>)
}

export default App;