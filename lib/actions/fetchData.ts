import axios from "axios";

const fetchData = async <T>(
  url: string,
  langCode: string,
  params?: Record<string, any> 
): Promise<T[]> => {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/${url}`;

    const response = await axios.get<T[]>(apiUrl, {
      headers: {
        "Content-Language": langCode,
      },
      params: params && Object.keys(params).length > 0 ? params : undefined,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

export default fetchData;
