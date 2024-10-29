import "./globals.css";
import MainHeader from "@/components/layout/MainHeader/MainHeader";

export const metadata = {
  title: "NextLevel Food",
  description: "Delicious meals, shared by a food-loving community.",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <MainHeader />
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
