import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:4000";

interface Person {
  id: number;
  fullName: string;
  gender: string;
  birthDate: string;
  birthMonth: number;
  birthYear: number;
  countryOfBirth: string;
  yearMovedToUK?: number;
  ethnicity: string;
  employmentStatus: string;
  occupation: string;
  industry: string;
  highestIncomeJobTitle: string;
  contactNumber: string;
  email: string;
  cityOfResidence: string;
  postcode: string;
  county: string;
  familyStatus: string;
  childrenAge: string;
  listingStatus: string;
}

const App: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [filters, setFilters] = useState<any>({});
  const [duplicates, setDuplicates] = useState<any[]>([]);

  const fetchPeople = async () => {
    const query = new URLSearchParams(filters).toString();
    const res = await axios.get(`${API_URL}/person?${query}`);
    setPeople(res.data);
  };

  const handleChange = (id: number, field: string, value: any) => {
    setPeople((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const saveChanges = async (id: number, person: Person) => {
    await axios.put(`${API_URL}/person/${id}`, person);
    fetchPeople();
  };

  const fetchDuplicates = async () => {
    const res = await axios.get(`${API_URL}/person/duplicates`);
    setDuplicates(res.data);
  };

  const exportExcel = () => {
    window.open(`${API_URL}/person/export`, "_blank");
  };

  useEffect(() => {
    fetchPeople();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Realtime Database Viewer</h1>

      <div style={{ marginBottom: "15px" }}>
        <input
          placeholder="Filter by Full Name"
          onChange={(e) =>
            setFilters({ ...filters, fullName: e.target.value })
          }
        />
        <button onClick={fetchPeople}>Apply Filters</button>
        <button onClick={fetchDuplicates}>Find Duplicates</button>
        <button onClick={exportExcel}>Export to Excel</button>
      </div>

      {duplicates.length > 0 && (
        <div>
          <h3>Duplicate Entries:</h3>
          {duplicates.map((d, i) => (
            <div key={i}>
              {d.fullName} | {d.email} | {d.contactNumber}
            </div>
          ))}
        </div>
      )}

      <table border={1} cellPadding={5}>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Occupation</th>
            <th>Listing Status</th>
            <th>Save</th>
          </tr>
        </thead>
        <tbody>
          {people.map((p) => (
            <tr key={p.id}>
              <td>
                <input
                  value={p.fullName}
                  onChange={(e) =>
                    handleChange(p.id, "fullName", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  value={p.email}
                  onChange={(e) => handleChange(p.id, "email", e.target.value)}
                />
              </td>
              <td>
                <input
                  value={p.contactNumber}
                  onChange={(e) =>
                    handleChange(p.id, "contactNumber", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  value={p.occupation}
                  onChange={(e) =>
                    handleChange(p.id, "occupation", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  value={p.listingStatus}
                  onChange={(e) =>
                    handleChange(p.id, "listingStatus", e.target.value)
                  }
                />
              </td>
              <td>
                <button onClick={() => saveChanges(p.id, p)}>Save</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
