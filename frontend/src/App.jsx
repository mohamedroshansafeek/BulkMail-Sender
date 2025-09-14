import { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import "./index.css"; 

function App() {
  const [msg, setmsg] = useState("");
  const [status, setstatus] = useState(false);
  const [emailList, setEmailList] = useState([]);

  function handlemsg(evt) {
    setmsg(evt.target.value);
  }

  function handlefile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const emailList = XLSX.utils.sheet_to_json(worksheet, { header: "A" });
      const totalemail = emailList.map((item) => item.A);
      setEmailList(totalemail);
    };
    reader.readAsArrayBuffer(file);
  }

  function send() {
    setstatus(true);
    axios.post("https://bulkmail-sender-2csw.onrender.com/sendmail", { msg: msg, emailList: emailList })
      .then(function (data) {
        if (data.data === true) {
          alert("Email Sent Successfully");
          setstatus(false);
        } else {
          alert("Failed");
        }
      })
      .catch(() => setstatus(false));
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 flex items-center justify-center p-6">
      {/* Background Blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-md bg-opacity-90">
        <h1 className="text-3xl font-bold text-center text-indigo-900 mb-4">
          🚀 Bulk Mail Sender
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Upload your email list & send personalized messages instantly.
        </p>

        {/* Message Box */}
        <textarea
          onChange={handlemsg}
          value={msg}
          className="w-full h-32 p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400 mb-4"
          placeholder="Enter your email message..."
        ></textarea>

        {/* File Upload */}
        <div className="relative border-2 border-dashed border-gray-400 rounded-lg py-8 flex flex-col items-center justify-center mb-4 cursor-pointer hover:bg-gray-50">
          <input
            type="file"
            onChange={handlefile}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-lg"
          />
          <p className="text-gray-600">📂 Drag & Drop or Click to Upload File</p>
        </div>

        <p className="text-gray-700 text-sm mb-4 text-center">
          Total Emails Found: <span className="font-semibold">{emailList.length}</span>
        </p>

        {/* Send Button */}
        <button
          onClick={send}
          disabled={status}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg shadow-md transition-all"
        >
          {status ? "📨 Sending..." : "Send Emails"}
        </button>
      </div>
    </div>
  );
}

export default App;
