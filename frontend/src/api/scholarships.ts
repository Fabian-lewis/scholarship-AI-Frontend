// frontend/src/api/scholarship.ts - frontend API helper


export interface Scholarship {
    id?: string;
    name?: string;
    provider?: string;
    deadline?: string;
    posted_at?: string;
    link?: string;
    field_tags?: string;
    country_tags?: string;
    level_tags?: string;
    amount?: string;
    source?: string;
    description?: string;
    score?:number | null; // optional
}

const API_URL = import.meta.env.VITE_API_URL
export async function getRecentScholarships(limit=6): Promise<Scholarship[]> {
    try{
        const res = await fetch(`${API_URL}/scholarships/recent?limit=${limit}`);
        if (!res.ok) throw new Error (`Error fetching scholarships: ${res.status}`);
        const data = await res.json();
        return data.scholarships || [];
    } catch (error) {
        console.error("Failed to load scholarships:", error)
        return [];
    }
}

export async function getScholarships(userId: string): Promise<Scholarship[]> {
    try {
        const res = await fetch(`${API_URL}/recommend_scholarships/${userId}`);
        if (!res.ok) throw new Error(`Error fetching scholarships: ${res.status}`);
        const data = await res.json();
        return data.scholarships || [];
    } catch (error) {
        console.error("Failed to load scholarships:", error);
        return [];
    }
}