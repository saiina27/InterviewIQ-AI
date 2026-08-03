import { useEffect, useState } from "react";

function CircularProgress({ score = 0 }) {

  const radius = 70;
  const stroke = 10;

  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const safeScore = Math.min(
    Math.max(score, 0),
    100
  );

  const [progress, setProgress] = useState(0);


  useEffect(() => {

    const timer = setTimeout(() => {
      setProgress(safeScore);
    }, 200);

    return () => clearTimeout(timer);

  }, [safeScore]);


  const offset =
    circumference -
    (progress / 100) * circumference;


  const getStatus = () => {

    if (safeScore >= 85)
      return {
        text: "Excellent",
        color: "text-green-600"
      };

    if (safeScore >= 70)
      return {
        text: "Good",
        color: "text-blue-600"
      };

    return {
      text: "Needs Improvement",
      color: "text-orange-600"
    };

  };


  const status = getStatus();


  return (

    <div className="flex flex-col items-center">

      <div className="relative">

        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >

          <circle
            stroke="#E5E7EB"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />


          <circle
            stroke="#2563EB"
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-1000 ease-out"
          />

        </svg>


        <div className="absolute inset-0 flex flex-col items-center justify-center">

          <h1 className="text-4xl font-bold text-blue-600">
            {Math.round(progress)}%
          </h1>

          <p className="text-sm text-gray-500">
            ATS Score
          </p>

        </div>

      </div>


      <p className={`mt-3 font-semibold ${status.color}`}>
        {status.text}
      </p>


    </div>

  );

}


export default CircularProgress;