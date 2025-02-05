// components/Dashboard.tsx
"use client";

import { useEffect, useState } from "react";
import { formatToBangkokTime } from "../../../utils/dateUtils";
import * as XLSX from "xlsx"; // Import xlsx library


interface EmailLog {
    email: string;
    status: string;
    clicked_at: string | null;
    clicked_summit: string | null;
    clicked_status: boolean | null;
}

export default function Dashboard() {
    const [logs, setLogs] = useState<EmailLog[]>([]);
    const [progress, setProgress] = useState(0); // Progress state for the progress bar
    const [searchTerm, setSearchTerm] = useState(""); // State for search term
    const [filterClickedAt, setFilterClickedAt] = useState(false); // State for filtering emails without Clicked At
    const [filterClickedSummit, setFilterClickedSummit] = useState(false); // State for filtering emails without Clicked Summit

    useEffect(() => {
      fetch("/api/email/logs")
        .then((res) => res.json())
        .then((data) => {
          setLogs(data);
          // Simulate progress based on the number of logs
          setProgress((data.length / 100) * 100); // Adjust the denominator based on your total email count
        });
    }, []);

    // Function to export table data to Excel
    const exportToExcel = () => {
      // Map the logs data to a format suitable for Excel
      const data = logs.map((log) => ({
        Email: log.email,
        Status: log.status,
        "Clicked At": formatToBangkokTime(log.clicked_at),
        "Clicked Summit": formatToBangkokTime(log.clicked_summit),
        "Clicked Status": log.clicked_status === true ? "Yes" : log.clicked_status === false ? "No" : "N/A",
      }));

      // Create a new workbook and worksheet
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Email Logs");

      // Generate Excel file and trigger download
      XLSX.writeFile(workbook, "Email_Logs.xlsx");
    };

    // Calculate summary counts
    const totalEmails = logs.length;
    const totalClickedAt = logs.filter(log => log.clicked_at !== null).length;
    const totalClickedSummit = logs.filter(log => log.clicked_summit !== null).length;

    // Filtered logs based on search term and filters
    const filteredLogs = logs.filter((log) => {
      const matchesSearch = log.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClickedAtFilter = filterClickedAt ? log.clicked_at === null : true;
      const matchesClickedSummitFilter = filterClickedSummit ? log.clicked_summit === null : true;
      return matchesSearch && matchesClickedAtFilter && matchesClickedSummitFilter;
    });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Phishing Test Dashboard
        </h1>

        {/* Summary Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">Total Emails</p>
              <p className="text-2xl font-bold text-gray-900">{totalEmails}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">Clicked At</p>
              <p className="text-2xl font-bold text-gray-900">{totalClickedAt}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">Clicked Summit</p>
              <p className="text-2xl font-bold text-gray-900">{totalClickedSummit}</p>
            </div>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Email Sending Progress</h2>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
            <div
              className="bg-green-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">{progress.toFixed(2)}% Complete</p>
        </div>
        {/* Search and Filters Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search by email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {/* Filter for Clicked At */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filterClickedAt}
                onChange={() => setFilterClickedAt(!filterClickedAt)}
                className="form-checkbox h-5 w-5 text-green-600"
              />
              <span className="text-sm text-gray-700">Show only emails without Clicked At</span>
            </label>
            {/* Filter for Clicked Summit */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filterClickedSummit}
                onChange={() => setFilterClickedSummit(!filterClickedSummit)}
                className="form-checkbox h-5 w-5 text-green-600"
              />
              <span className="text-sm text-gray-700">Show only emails without Clicked Summit</span>
            </label>
          </div>
        </div>
        {/* Export Button */}
        <button
          onClick={exportToExcel}
          className="mb-4 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
        >
          Export to Excel
        </button>
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clicked At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clicked Summit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clicked Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.email} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {log.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                     {formatToBangkokTime(log.clicked_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                     {formatToBangkokTime(log.clicked_summit)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {log.clicked_status === true ? (
                      <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                        Yes
                      </span>
                    ) : log.clicked_status === false ? (
                      <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">
                        No
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">
                        N/A
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}