import Image from "next/image";
import Link from "next/link"
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div>
      <Link href="/map"><button className="block bg-blue-500 border-double border-1 border-black rounded">To Map</button></Link>
      <Link href="/charts/"><button className="block bg-green-500">To Country</button></Link>
    </div>
  );
}
