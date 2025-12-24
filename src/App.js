import React, { useState } from "react";

function App() {
  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    body: "",
    fileName: "",
    latitude: "",
    longitude: "",
    locationName: ""
  });

  const [loadingLocation, setLoadingLocation] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Reverse geocoding (fast, async)
  const fetchLocationDetails = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
      );
      const data = await res.json();

      const address = data.address || {};
      const area =
        address.suburb ||
        address.neighbourhood ||
        address.village ||
        "";
      const city = address.city || address.town || "";
      const pincode = address.postcode || "";

      setFormData((prev) => ({
        ...prev,
        locationName: `${area}, ${city} - ${pincode}`
      }));
    } catch {
      setFormData((prev) => ({
        ...prev,
        locationName: "Location unavailable"
      }));
    }
  };

  // Fast current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        // instant UI update
        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lon,
          locationName: "Detecting area..."
        }));

        // non-blocking reverse lookup
        setTimeout(() => fetchLocationDetails(lat, lon), 0);

        setLoadingLocation(false);
      },
      (error) => {
        setLoadingLocation(false);
        alert("Location error: " + error.message);
      },
      {
        enableHighAccuracy: false, // faster
        timeout: 3000,
        maximumAge: 300000 // cached location (5 mins)
      }
    );
  };

  // Send email
  const sendEmail = async () => {
    if (!formData.to || !formData.subject) {
      alert("Recipient email and subject are required");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error(await response.text());
      alert("Email sent successfully");
    } catch (error) {
      alert("Error sending email: " + error.message);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none"
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #e3f2fd, #ede7f6)"
      }}
    >
      <div
        style={{
          width: "420px",
          padding: "32px",
          borderRadius: "16px",
          background: "#fff",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "6px" }}>
          📧 Send Email
        </h2>
        <p style={{ textAlign: "center", fontSize: "13px", color: "#666" }}>
          Email with auto-detected location
        </p>

        <input
          type="email"
          name="to"
          placeholder="Recipient Email"
          value={formData.to}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          style={inputStyle}
        />

        <textarea
          name="body"
          placeholder="Email Body"
          rows={4}
          value={formData.body}
          onChange={handleChange}
          style={{ ...inputStyle, resize: "none" }}
        />

        <input
          type="text"
          name="fileName"
          placeholder="PDF File Name"
          value={formData.fileName}
          onChange={handleChange}
          style={inputStyle}
        />

        <button
          onClick={getCurrentLocation}
          disabled={loadingLocation}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "12px",
            background: loadingLocation ? "#bdbdbd" : "#4caf50",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: loadingLocation ? "not-allowed" : "pointer"
          }}
        >
          {loadingLocation ? "Fetching Location..." : "📍 Fetch Current Location"}
        </button>

        {formData.locationName && (
          <div
            style={{
              background: "#f5f7ff",
              padding: "10px",
              borderRadius: "8px",
              fontSize: "13px",
              marginBottom: "16px"
            }}
          >
            📍 {formData.locationName}
          </div>
        )}

        <button
          onClick={sendEmail}
          style={{
            width: "100%",
            padding: "14px",
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            fontWeight: "700",
            fontSize: "15px",
            cursor: "pointer"
          }}
        >
          🚀 Send Email
        </button>
      </div>
    </div>
  );
}

export default App;
