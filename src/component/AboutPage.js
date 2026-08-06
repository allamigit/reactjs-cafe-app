
import '../App.css';

export default function AboutPage() {
  return (
    <div 
      className="App d-flex flex-column align-items-center text-center" 
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f9fafb 0%, #e9ecef 100%)",
        padding: "40px"
      }}
    >
      <h3 style={{ fontSize: "2em", marginBottom: "20px", color: "#333" }}>
        About <span style={{ color: "#007bff" }}>reactjsCafé</span>
      </h3>

      <p style={{ maxWidth: "700px", fontSize: "1.1em", lineHeight: "1.6", color: "#555" }}>
        <strong>reactjsCafé</strong> is a fictional café application created 
        solely for <strong>learning and demonstration</strong> purposes.  
        It showcases various <strong>ReactJS</strong> features, including:
      </p>

      <ul style={{ textAlign: "left", maxWidth: "500px", color: "#444", fontSize: "1em", marginTop: "10px" }}>
        <li> Component-based UI design</li>
        <li> useState, useEffect, useMemo, useRef and props handling</li>
        <li> Dynamic checkout and payment simulation</li>
        <li> Framer Motion animations and smooth transitions</li>
        <li> React Router navigation</li>
        <li> React Context for current order to be accessed from other components</li>
      </ul>

      <p style={{ marginTop: "20px", color: "#007bff" }}>
        This project does not represent a real café business.  
        All names, items, and transactions are for educational and demonstration use only.
      </p>
    </div>
  );
}
