import Image from "next/image";
import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="auth-container">
      <section className="flex flex-col justify-center items-center w-2/3 h-full">
        <div className="text-center">
          <div className="flex flex-col align-items-start">
            <div className="flex gap-2 mb-1">
              {Array(2)
                .fill(0)
                .map((_, index) => (
                  <Image
                    key={`circle-top-${index}`}
                    src="/circle.svg"
                    alt="Circle"
                    width={24}
                    height={24}
                    className="circle-asset"
                  />
                ))}
            </div>
            <div className="flex items-center">
              <span className="w-6 text-light-100 text-4xl font-bold">G</span>
              <Image
                src="/circle.svg"
                alt="Circle"
                width={24}
                height={24}
                className="mt-0.5 ml-2"
              />
              <span className="text-4xl font-bold text-light-100 w-6 ml-3">
                English
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="auth-form">
        <div>{children}</div>
      </section>
    </main>
  );
};

export default Layout;
