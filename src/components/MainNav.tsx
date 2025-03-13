import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calculator, Home, Info, ChevronDown } from "lucide-react";

export function MainNav() {
  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center font-bold text-xl">
              Chess Rating Estimator
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-100 flex items-center">
              <Home className="mr-1 h-4 w-4" />
              Home
            </Link>
            
            <div className="relative group">
              <button className="px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-100 flex items-center">
                <Calculator className="mr-1 h-4 w-4" />
                Calculators
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              
              <div className="absolute z-10 hidden group-hover:block pt-2 left-0 w-48">
                <div className="bg-white rounded-md shadow-lg border overflow-hidden">
                  <Link href="/calculators/fide" className="block px-4 py-2 text-sm hover:bg-slate-100">
                    FIDE Calculator
                  </Link>
                  <Link href="/calculators/uscf" className="block px-4 py-2 text-sm hover:bg-slate-100">
                    USCF Calculator
                  </Link>
                  <Link href="/calculators/ecf" className="block px-4 py-2 text-sm hover:bg-slate-100">
                    ECF Calculator
                  </Link>
                </div>
              </div>
            </div>
            
            <Link href="/about" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-100 flex items-center">
              <Info className="mr-1 h-4 w-4" />
              About
            </Link>
          </div>
          
          <div className="md:hidden">
            <Button variant="ghost" size="sm" className="text-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
} 