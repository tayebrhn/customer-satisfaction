// const renderQuestion = (question: Question) => {
//   const fieldName = String(question.id);

//   switch (question.type) {
//     case "text":
//       // TextQuestion
//       return (
//         <input
//           {...register(fieldName)}
//           placeholder={question.placeholder || ""}
//           className="border p-2 rounded w-full"
//         />
//       );

//     case "single_choice":
//       // ObjectOptionsQuestion or StringArrayQuestion or ValueLabelQuestion
//       return (
//         <div className="space-y-1">
//           {Array.isArray(question.options) &&
//             question.options.map((option, index) => {
//               let optionValue: string;
//               let optionLabel: string;
//               let optionId: string | number;
//               let isOther = false;

//               if (typeof option === "string") {
//                 // StringArrayQuestion
//                 optionValue = option;
//                 optionLabel = option;
//                 optionId = index;
//               } else if ("value" in option && "label" in option) {
//                 // ValueLabelQuestion
//                 optionValue = option.value;
//                 optionLabel = option.label;
//                 optionId = option.value;
//               } else {
//                 // ObjectOptionsQuestion
//                 optionValue = option.text;
//                 optionLabel = option.text;
//                 optionId = option.id;
//                 isOther = !!option.is_other;
//               }

//               const isOtherSelected =
//                 formValues[question.id] === optionValue && isOther;

//               return (
//                 <div key={optionId} className="flex flex-col gap-1">
//                   <label className="flex items-center gap-2">
//                     <input
//                       type="radio"
//                       value={optionValue}
//                       {...register(fieldName)}
//                       onChange={(e) => {
//                         setValue(fieldName, e.target.value);
//                       }}
//                     />
//                     {optionLabel}
//                   </label>

//                   {isOtherSelected && (
//                     <input
//                       {...register(`${fieldName}_other`)}
//                       placeholder="Please specify..."
//                       className="border p-2 rounded w-auto ml-6"
//                     />
//                   )}
//                 </div>
//               );
//             })}
//         </div>
//       );

//     case "rating":
//       // RatingQuestion
//       const scaleCount = question.scale
//         ? Number(question.scale.split("-")[1])
//         : 5;

//       return (
//         <div className="flex gap-2">
//           {Array.from({ length: scaleCount }, (_, i) => i + 1).map((val) => (
//             <label key={val} className="flex flex-col items-center">
//               <input type="radio" value={val} {...register(fieldName)} />
//               {val}
//             </label>
//           ))}
//         </div>
//       );

//     default:
//       return null;
//   }
// };
