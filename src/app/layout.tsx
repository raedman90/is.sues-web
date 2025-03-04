"use client";

import { Poppins } from "next/font/google";
import "@/app/globals.css"; 
import { AuthProvider } from "@/app/contexts/AuthProvider";
import { IssuesProvider } from "@/app/contexts/IssuesContext";
import { CompanyProvider } from "@/app/contexts/CompanyContext";
import { DepartmentProvider } from "@/app/contexts/DepartmentContext";
import { LabelProvider } from "@/app/contexts/LabelContext";
import { ThemeProvider } from "@/app/contexts/ThemeContext";
import { CommentsProvider } from "@/app/contexts/CommentsContext";

const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" className={poppins.className}>
      <body className="bg-gray-100">
        <AuthProvider>
          <CompanyProvider>
            <DepartmentProvider>
              <IssuesProvider>
                <LabelProvider>
                  <CommentsProvider>
                    <ThemeProvider>
                      {children}
                    </ThemeProvider>
                  </CommentsProvider>
                </LabelProvider>
              </IssuesProvider>
            </DepartmentProvider>
          </CompanyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
