import { DocsCard } from "@/components/atomsComponents";

const cardData = [
  { id: 1, title: "React", created: "Jan 2025" , description: "A JavaScript library for building user interfaces" },
  { id: 2, title: "Vue", created: "Feb 2025", description: "A progressive JavaScript framework for building user interfaces" },
  { id: 3, title: "Angular", created: "Mar 2025", description: "A platform for building mobile and desktop web applications" },
  { id: 4, title: "Svelte", created: "Apr 2025", description: "A radical new approach to building user interfaces" },
  { id: 5, title: "Next.js", created: "May 2025", description: "The React Framework for Production" },
  { id: 6, title: "Bamboo", created: "Jun 2025", description: "A modern CSS framework" },
  { id: 7, title: "Tailwind CSS", created: "Jul 2025", description: "A utility-first CSS framework" },
  { id: 8, title: "Framer Motion", created: "Aug 2025", description: "A library for creating animations in React" },
  { id: 9, title: "TypeScript", created: "Sep 2025", description: "A superset of JavaScript that adds static types" },
  { id: 10, title: "GraphQL", created: "Oct 2025", description: "A query language for your API" },
  { id: 11, title: "Node.js", created: "Nov 2025", description: "JavaScript runtime built on Chrome's V8 engine" },
  { id: 12, title: "Express.js", created: "Dec 2025", description: "Fast, unopinionated, minimalist web framework for Node.js" },
  { id: 13, title: "MongoDB", created: "Jan 2026", description: "A document database with the scalability and flexibility that you want" },
  { id: 14, title: "PostgreSQL", created: "Feb 2026", description: "The world's most advanced open source relational database" },
  { id: 15, title: "Redis", created: "Mar 2026", description: "In-memory data structure store, used as a database, cache, and message broker" },
  { id: 16, title: "Docker", created: "Apr 2026", description: "Platform for developing, shipping, and running applications in containers" },
  { id: 17, title: "Kubernetes", created: "May 2026", description: "Open-source system for automating deployment, scaling, and management of containerized applications" },
  { id: 18, title: "GraphQL", created: "Jun 2026", description: "A query language for your API" },
  { id: 19, title: "Apollo Client", created: "Jul 2026", description: "A comprehensive state management library for JavaScript" },
  { id: 20, title: "Jest", created: "Aug 2026", description: "A delightful JavaScript testing framework" },
  { id: 21, title: "Cypress", created: "Sep 2026", description: "A next generation front end testing tool" },
  { id: 22, title: "Storybook", created: "Oct 2026", description: "UI component workshop for React, Vue, and Angular" },
  { id: 23, title: "Webpack", created: "Nov 2026", description: "A static module bundler for modern JavaScript applications" },
  { id: 24, title: "Babel", created: "Dec 2026", description: "A JavaScript compiler" },
  { id: 25, title: "ESLint", created: "Jan 2027", description: "A static code analysis tool for identifying problematic patterns in JavaScript code" },
  { id: 26, title: "Prettier", created: "Feb 2027", description: "An opinionated code formatter" },
  { id: 27, title: "Tailwind CSS", created: "Mar 2027", description: "A utility-first CSS framework for creating custom designs" },
  { id: 28, title: "Bootstrap", created: "Apr 2027", description: "The most popular HTML, CSS, and JS library in the world" },
  { id: 29, title: "Foundation", created: "May 2027", description: "A responsive front-end framework" },
  { id: 30, title: "Bulma", created: "Jun 2027", description: "A modern CSS framework based on Flexbox" },
  { id: 31, title: "Material-UI", created: "Jul 2027", description: "React components for faster and easier web development" },
  { id: 32, title: "Ant Design", created: "Aug 2027", description: "A design system for enterprise-level products" },
  { id: 33, title: "Chakra UI", created: "Sep 2027", description: "A simple, modular and accessible component library for React" },
  { id: 34, title: "Semantic UI", created: "Oct 2027", description: "A development framework that helps create beautiful, responsive layouts using human-friendly HTML" },
  { id: 35, title: "Foundation", created: "Nov 2027", description: "A responsive front-end framework" },
  { id: 36, title: "Material Design", created: "Dec 2027", description: "A design language developed by Google" },
  { id: 37, title: "Tailwind UI", created: "Jan 2028", description: "A collection of professionally designed, pre-built, fully responsive UI components" },
  { id: 38, title: "Framer Motion", created: "Feb 2028", description: "A production-ready motion library for React" },
  { id: 39, title: "GSAP", created: "Mar 2028", description: "A JavaScript library for creating high-performance animations" },
  { id: 40, title: "Anime.js", created: "Apr 2028", description: "A lightweight JavaScript animation library with a simple API" },
  { id: 41, title: "Three.js", created: "May 2028", description: "A cross-browser JavaScript library and application programming interface used to create and display animated 3D computer graphics in a web browser" },
  { id: 42, title: "D3.js", created: "Jun 2028", description: "A JavaScript library for producing dynamic, interactive data visualizations in web browsers" },
  { id: 43, title: "Chart.js", created: "Jul 2028", description: "A simple yet flexible JavaScript charting library for designers and developers" },
  { id: 44, title: "Highcharts", created: "Aug 2028", description: "A charting library written in pure JavaScript, offering an easy way of adding interactive charts to your web site or web application" },
  { id: 45, title: "Leaflet", created: "Sep 2028", description: "An open-source JavaScript library for mobile-friendly interactive maps" },
];
const DocsCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-3 md:gap-5 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
      {cardData.map((card) => (
        <DocsCard
          key={card.id}
          hoverOpen={false}
          card={card}
          active=""
          setActiveCard={() => {}}
        />
      ))}
    </div>
  );
};
export { DocsCards };
