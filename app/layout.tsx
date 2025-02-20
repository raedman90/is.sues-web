import { AuthProvider } from "@/app/contexts/AuthProvider";
import { IssuesProvider } from "@/app/contexts/IssuesContext";
import { CompanyProvider } from "@/app/contexts/CompanyContext";
import { DepartmentProvider } from "@/app/contexts/DepartmentContext";
import { LabelProvider } from "@/app/contexts/LabelContext";
import { ThemeProvider } from "@/app/contexts/ThemeContext";
import "@/styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body>
        <AuthProvider>
          <CompanyProvider>
            <DepartmentProvider>
              <IssuesProvider>
                <LabelProvider>
                  <ThemeProvider>{children}</ThemeProvider>
                </LabelProvider>
              </IssuesProvider>
            </DepartmentProvider>
          </CompanyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
