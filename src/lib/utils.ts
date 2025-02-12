import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";

const dnaSvg = `<svg fill="#0039e6" height="50px" width="50px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" stroke="#0039e6"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M413.876,34.73c0-19.151-15.579-34.73-34.729-34.73s-34.73,15.579-34.73,34.73c0,10.532-1.455,21.047-4.131,31.564 H171.685c-1.797-7.109-3.038-14.23-3.651-21.365h111.425c5.633,0,10.199-4.566,10.199-10.199c0-5.633-4.566-10.199-10.199-10.199 H166.055C161.686,10.342,148.457,0,132.854,0c-19.15,0-34.73,15.579-34.73,34.73c0,80.895,52.403,151.003,112.129,221.269 C152.28,324.16,98.124,395.274,98.124,477.27c0,19.15,15.579,34.73,34.73,34.73c14.823,0,27.501-9.338,32.476-22.438h181.339 c4.975,13.1,17.653,22.438,32.476,22.438c19.15,0,34.73-15.579,34.73-34.73c0-81.081-52.47-151.094-112.129-221.269 C359.721,187.84,413.876,116.726,413.876,34.73z M333.626,86.693c-2.959,7.47-6.47,14.947-10.444,22.438h-134.46 c-3.958-7.475-7.455-14.952-10.408-22.438H333.626z M215.876,151.968c-5.418-7.484-10.532-14.962-15.263-22.438H311.29 c-4.718,7.458-9.827,14.935-15.249,22.438H215.876z M280.638,172.367c-7.843,9.999-16.116,20.054-24.64,30.179 c-8.501-10.087-16.796-20.142-24.688-30.179H280.638z M118.523,34.73c0-7.902,6.43-14.332,14.332-14.332 c7.903,0,14.332,6.43,14.332,14.332c0,45.56,22.593,88.815,53.954,131.649c0.593,1.304,1.451,2.458,2.508,3.399 c12.033,16.193,25.266,32.335,38.956,48.524c-4.276,4.994-8.591,10.005-12.924,15.039c-1.996,2.318-3.994,4.64-5.992,6.963 C167.41,173.897,118.523,107.878,118.523,34.73z M147.186,477.27c0.001,7.902-6.429,14.332-14.332,14.332 c-7.902,0-14.332-6.43-14.332-14.332c0-83.55,64.368-158.316,126.617-230.62c61.544-71.485,119.674-139.007,119.674-211.919 c0-7.902,6.43-14.332,14.332-14.332c7.902,0,14.332,6.43,14.332,14.332c0,83.55-64.368,158.316-126.617,230.62 C205.317,336.836,147.186,404.358,147.186,477.27z M199.4,384.563c4.647-7.459,9.691-14.936,15.057-22.438h83.181 c5.362,7.483,10.41,14.961,15.069,22.438H199.4z M324.376,404.961c3.871,7.474,7.275,14.952,10.126,22.438H177.567 c2.857-7.471,6.268-14.948,10.155-22.438H324.376z M229.725,341.726c8.326-10.689,17.158-21.44,26.278-32.271 c9.092,10.788,17.949,21.54,26.328,32.271H229.725z M167.876,469.163c0.494-7.125,1.624-14.245,3.325-21.365h169.63 c1.686,7.109,2.813,14.229,3.304,21.365H167.876z M393.478,477.27c0,7.902-6.43,14.332-14.332,14.332 c-7.903,0-14.332-6.43-14.332-14.332c0-64.023-44.589-123.461-95.418-183.571c4.276-4.994,8.592-10.005,12.924-15.039 c1.996-2.318,3.994-4.64,5.993-6.964C344.529,338.013,393.478,403.95,393.478,477.27z"></path> </g> </g> <g> <g> <path d="M319.236,24.531h-5.1c-5.633,0-10.199,4.566-10.199,10.199c0,5.633,4.566,10.199,10.199,10.199h5.1 c5.633,0,10.199-4.566,10.199-10.199C329.435,29.097,324.869,24.531,319.236,24.531z"></path> </g> </g> </g></svg>`;
const header = `
<div class="header">
  <h1 class="header-title">Blueprint AI</h1>
  ${dnaSvg}
</div>
<div class="content">
`;


const cssStyles = `
  .header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    padding: 10px 5px;
    background: white;
    border-bottom: 1px solid #eee;
  }

  .header-title {
    font-size: 2.5rem;
    color: #374151;
    font-weight: bold;
    font-family: 'Space Grotesk', sans-serif;
    margin-right: 10px;
  }

  .content {
    padding-top: 100px;
  }



`;

export async function convertMarkdownToPdf(
  markdown: string,
  setLoading: (loading: boolean) => void
) {
  try {
    setLoading(true);

    const fullMarkdown = header + markdown +"</div>";
    const filename =
      markdown
        .split("\n")[0]
        .replace(/^#+\s*/, "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .substring(0, 50) + ".pdf";

    const params = new URLSearchParams();
    params.append("markdown", fullMarkdown);
    params.append("css", cssStyles);

    const response = await axios.post("https://md-to-pdf.fly.dev", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error converting markdown to PDF:", error);
  } finally {
    setLoading(false);
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
