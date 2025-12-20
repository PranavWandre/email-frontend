import React, { useState } from "react";

function App() {
  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    body: "",
    fileName: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const sendEmail = async () => {
    if (!formData.to || !formData.subject) {
      alert("Recipient email and subject are required");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error ${response.status}`);
      }

      const result = await response.text();
      alert("SUCCESS: " + result);
    } catch (error) {
      console.error("FULL ERROR:", error);
      alert("Error sending email:\n" + error.message);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)"
      }}
    >
      <div
        style={{
          width: "400px",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          background: "rgba(255, 255, 255, 0.95)"
        }}
      >
        <h2 style={{ textAlign: "center", color: "#1976d2", marginBottom: "25px" }}>
          Send Email with PDF
        </h2>

        <input
          type="email"
          name="to"
          placeholder="Recipient Email"
          value={formData.to}
          onChange={handleChange}
          style={{
            width: "100%",
            marginBottom: "15px",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)",
            fontSize: "15px"
          }}
        />

        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          style={{
            width: "100%",
            marginBottom: "15px",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)",
            fontSize: "15px"
          }}
        />

        <textarea
          name="body"
          placeholder="Email Body"
          value={formData.body}
          onChange={handleChange}
          rows={5}
          style={{
            width: "100%",
            marginBottom: "15px",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)",
            fontSize: "15px",
            resize: "vertical"
          }}
        />

        <input
          type="text"
          name="fileName"
          placeholder="PDF File Name (example.pdf)"
          value={formData.fileName}
          onChange={handleChange}
          style={{
            width: "100%",
            marginBottom: "20px",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)",
            fontSize: "15px"
          }}
        />

        <button
          onClick={sendEmail}
          style={{
            width: "100%",
            padding: "14px",
            backgroundColor: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#155a9c")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#1976d2")}
        >
          Send Email
        </button>
      </div>
    </div>
  );
}

export default App;
