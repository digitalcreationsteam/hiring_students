// "use client";
// /*
//  * Documentation:
//  * Avatar — https://app.subframe.com/3f5af6112821/library?component=Avatar_bec25ae6-5010-4485-b46b-cf79e3943ab2
//  */

// import React from "react";
// import * as SubframeUtils from "../utils";

// interface AvatarRootProps extends React.HTMLAttributes<HTMLDivElement> {
//   variant?: "brand" | "neutral" | "error" | "success" | "warning";
//   size?: "x-large" | "large" | "medium" | "small" | "x-small";
//   children?: React.ReactNode;
//   image?: string;
//   square?: boolean;
//   className?: string;
// }

// const AvatarRoot = React.forwardRef<HTMLDivElement, AvatarRootProps>(
//   function AvatarRoot(
//     {
//       variant = "brand",
//       size = "medium",
//       children,
//       image,
//       square = false,
//       className,
//       ...otherProps
//     }: AvatarRootProps,
//     ref
//   ) {
//     return (
//       <div
//         className={SubframeUtils.twClassNames(
//           "group/bec25ae6 flex h-8 w-8 flex-col items-center justify-center gap-2 overflow-hidden rounded-full bg-brand-100 relative",
//           {
//             "rounded-md": square,
//             "h-5 w-5": size === "x-small",
//             "h-6 w-6": size === "small",
//             "h-12 w-12": size === "large",
//             "h-16 w-16": size === "x-large",
//             "bg-warning-100": variant === "warning",
//             "bg-success-100": variant === "success",
//             "bg-error-100": variant === "error",
//             "bg-neutral-100": variant === "neutral",
//           },
//           className
//         )}
//         ref={ref}
//         {...otherProps}
//       >
//         {children ? (
//           <span
//             className={SubframeUtils.twClassNames(
//               "line-clamp-1 w-full font-['Inter'] text-[14px] font-[500] leading-[14px] text-brand-800 text-center absolute",
//               {
//                 "font-['Inter'] text-[10px] font-[500] leading-[10px] tracking-normal":
//                   size === "x-small" || size === "small",
//                 "font-['Inter'] text-[18px] font-[500] leading-[18px] tracking-normal":
//                   size === "large",
//                 "font-['Inter'] text-[24px] font-[500] leading-[24px] tracking-normal":
//                   size === "x-large",
//                 "text-warning-800": variant === "warning",
//                 "text-success-800": variant === "success",
//                 "text-error-800": variant === "error",
//                 "text-neutral-800": variant === "neutral",
//               }
//             )}
//           >
//             {children}
//           </span>
//         ) : null}
//         {image ? (
//           <img
//             className={SubframeUtils.twClassNames(
//               "h-8 w-8 flex-none object-cover absolute",
//               {
//                 "h-5 w-5 flex-none": size === "x-small",
//                 "h-6 w-6 flex-none": size === "small",
//                 "h-12 w-12 flex-none": size === "large",
//                 "h-16 w-16 flex-none": size === "x-large",
//               }
//             )}
//             src={image}
//             onError={(e) => {
//               // fallback to a safe default image if load fails
//               const target = e.currentTarget as HTMLImageElement;
//               target.onerror = null;
//               target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400";
//             }}
//           />
//         ) : null}
//       </div>
//     );
//   }
// );

// export const Avatar = AvatarRoot;

"use client";
import React from "react";
import * as SubframeUtils from "../utils";
import { colors } from "../../common/Colors";

// Define a type for colors to ensure they're strings
type ColorString = string;

// Helper to safely get color value
const getColorString = (color: any): ColorString => {
  if (typeof color === "string") return color;
  if (color && typeof color === "object") {
    // Try to get the main color (600, 800, or 400)
    return color[600] || color[800] || color[400] || color[200] || "#000000";
  }
  return "#000000";
};

// Helper to get light color
const getLightColor = (color: any): string => {
  if (typeof color === "string") return color + "20";
  if (color && typeof color === "object") {
    // Use a light shade (50, 100, or 200)
    return color[50] || color[100] || color[200] || "#00000020";
  }
  return "#00000020";
};

interface AvatarRootProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "brand" | "neutral" | "error" | "success" | "warning";
  size?: "x-large" | "large" | "medium" | "small" | "x-small";
  children?: React.ReactNode;
  image?: string;
  square?: boolean;
  className?: string;
}

const AvatarRoot = React.forwardRef<HTMLDivElement, AvatarRootProps>(
  function AvatarRoot(
    {
      variant = "brand",
      size = "medium",
      children,
      image,
      square = false,
      className,
      ...otherProps
    }: AvatarRootProps,
    ref
  ) {
    // Get colors from your colors object
    const backgroundColor = 
      variant === "brand" ? getLightColor(colors.primary) :
      variant === "neutral" ? getLightColor(colors.neutral) :
      variant === "error" ? getLightColor(colors.background) :
      variant === "success" ? getLightColor(colors.background) :
      variant === "warning" ? getLightColor(colors.background) :
      getLightColor(colors.primary);

    const textColor = 
      variant === "brand" ? getColorString(colors.primary) :
      variant === "neutral" ? getColorString(colors.neutral) :
      variant === "error" ? getColorString(colors.background) :
      variant === "success" ? getColorString(colors.background) :
      variant === "warning" ? getColorString(colors.background) :
      getColorString(colors.primary);

    return (
      <div
        className={SubframeUtils.twClassNames(
          "group/bec25ae6 flex h-8 w-8 flex-col items-center justify-center gap-2 overflow-hidden rounded-full relative",
          {
            "rounded-md": square,
            "h-5 w-5": size === "x-small",
            "h-6 w-6": size === "small",
            "h-12 w-12": size === "large",
            "h-16 w-16": size === "x-large",
          },
          className
        )}
        ref={ref}
        {...otherProps}
        style={{
          backgroundColor,
          ...otherProps.style
        }}
      >
        {children ? (
          <span
            className={SubframeUtils.twClassNames(
              "line-clamp-1 w-full font-['Inter'] text-[14px] font-[500] leading-[14px] text-center absolute",
              {
                "font-['Inter'] text-[10px] font-[500] leading-[10px] tracking-normal":
                  size === "x-small" || size === "small",
                "font-['Inter'] text-[18px] font-[500] leading-[18px] tracking-normal":
                  size === "large",
                "font-['Inter'] text-[24px] font-[500] leading-[24px] tracking-normal":
                  size === "x-large",
              }
            )}
            style={{ color: textColor }}
          >
            {children}
          </span>
        ) : null}
        {image ? (
          <img
            className={SubframeUtils.twClassNames(
              "h-8 w-8 flex-none object-cover absolute",
              {
                "h-5 w-5 flex-none": size === "x-small",
                "h-6 w-6 flex-none": size === "small",
                "h-12 w-12 flex-none": size === "large",
                "h-16 w-16 flex-none": size === "x-large",
              }
            )}
            src={image}
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.onerror = null;
              target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400";
            }}
          />
        ) : null}
      </div>
    );
  }
);

export const Avatar = AvatarRoot;