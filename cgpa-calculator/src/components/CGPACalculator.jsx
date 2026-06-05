import { useState, useEffect } from "react";
import "./CGPACalculator.css";

function CGPACalculator() {
  const [semesterCount, setSemesterCount] = useState("");
  const [sgpas, setSgpas] = useState([]);
  const [cgpa, setCgpa] = useState("0.00");
  const [percentage, setPercentage] = useState("0.00");
  const [grade, setGrade] = useState("-");
  const [targetCgpa, setTargetCgpa] = useState("");
  const [requiredSgpa, setRequiredSgpa] = useState("");

  useEffect(() => {
    const savedData = localStorage.getItem("cgpaData");

    if (savedData) {
      const data = JSON.parse(savedData);
      setSemesterCount(data.semesterCount || "");
      setSgpas(data.sgpas || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "cgpaData",
      JSON.stringify({
        semesterCount,
        sgpas,
      })
    );
  }, [semesterCount, sgpas]);

  const handleSemesterChange = (e) => {
    const count = Number(e.target.value);

    setSemesterCount(count);
    setSgpas(Array(count).fill(""));
    setCgpa("0.00");
    setPercentage("0.00");
    setGrade("-");
    setRequiredSgpa("");
  };

  const handleSgpaChange = (index, value) => {
    if (Number(value) > 10) {
      alert("SGPA cannot exceed 10");
      return;
    }

    const updated = [...sgpas];
    updated[index] = value;
    setSgpas(updated);
  };

  const calculateCGPA = () => {
    const values = sgpas
      .filter((value) => value !== "")
      .map(Number);

    if (values.length === 0) {
      alert("Please enter SGPA values");
      return;
    }

    const total = values.reduce((sum, val) => sum + val, 0);
    const result = total / values.length;

    setCgpa(result.toFixed(2));
    setPercentage((result * 9.5).toFixed(2));

    if (result >= 9) setGrade("O");
    else if (result >= 8) setGrade("A+");
    else if (result >= 7) setGrade("A");
    else if (result >= 6) setGrade("B");
    else setGrade("C");
  };

  const calculateRequiredSGPA = () => {
    if (!semesterCount || !targetCgpa) {
      alert("Enter Target CGPA");
      return;
    }

    const completed = sgpas
      .filter((s) => s !== "")
      .map(Number);

    const completedSum = completed.reduce(
      (a, b) => a + b,
      0
    );

    const remainingSemesters =
      Number(semesterCount) - completed.length;

    if (remainingSemesters <= 0) {
      setRequiredSgpa("All Semesters Completed");
      return;
    }

    const totalNeeded =
      Number(targetCgpa) * Number(semesterCount);

    const required =
      (totalNeeded - completedSum) /
      remainingSemesters;

    setRequiredSgpa(required.toFixed(2));
  };

  const resetCalculator = () => {
    setSemesterCount("");
    setSgpas([]);
    setCgpa("0.00");
    setPercentage("0.00");
    setGrade("-");
    setTargetCgpa("");
    setRequiredSgpa("");
    localStorage.removeItem("cgpaData");
  };

  return (
    <div className="container">
      <h1>
        🎓 Advanced CGPA & Academic Performance Tracker
      </h1>

      <p className="subtitle">
        Calculate your cumulative grade point average
      </p>

      <h3>Select Number of Semesters</h3>

      <select
        value={semesterCount}
        onChange={handleSemesterChange}
      >
        <option value="">Choose</option>

        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
          <option key={sem} value={sem}>
            {sem}
          </option>
        ))}
      </select>

      {sgpas.map((sgpa, index) => (
        <input
          key={index}
          type="number"
          step="0.01"
          min="0"
          max="10"
          placeholder={`Enter Semester ${index + 1} SGPA`}
          value={sgpa}
          onChange={(e) =>
            handleSgpaChange(index, e.target.value)
          }
        />
      ))}

      <button onClick={calculateCGPA}>
        Calculate CGPA
      </button>

      <div className="result-card">
        <h3>CGPA</h3>
        <div className="result-value">{cgpa}</div>
      </div>

      <div className="progress">
        <div
          className="progress-fill"
          style={{
            width: `${(Number(cgpa) / 10) * 100}%`,
          }}
        ></div>
      </div>

      <div className="result-card">
        <h3>Percentage</h3>
        <div className="result-value">
          {percentage}%
        </div>
      </div>

      <div className="result-card">
        <h3>Grade</h3>
        <div className="result-value">{grade}</div>
      </div>

      <div className="result-card">
        <h3>Status</h3>
        <div className="result-value">
          {Number(cgpa) >= 8
            ? "Excellent"
            : Number(cgpa) >= 7
            ? "Good"
            : Number(cgpa) >= 6
            ? "Average"
            : "Needs Improvement"}
        </div>
      </div>

      <div className="target-section">
        <h2>🎯 Target CGPA Planner</h2>

        <input
          type="number"
          step="0.01"
          min="0"
          max="10"
          placeholder="Enter Target CGPA"
          value={targetCgpa}
          onChange={(e) =>
            setTargetCgpa(e.target.value)
          }
        />

        <button onClick={calculateRequiredSGPA}>
          Calculate Required SGPA
        </button>

        {requiredSgpa && (
          <div className="result-card">
            <h3>Required SGPA</h3>
            <div className="result-value">
              {requiredSgpa}
            </div>
          </div>
        )}
      </div>

      <button
        className="reset-btn"
        onClick={resetCalculator}
      >
        Reset Calculator
      </button>

      <footer>
        Developed by Praneeth Kumar
      </footer>
    </div>
  );
}

export default CGPACalculator;