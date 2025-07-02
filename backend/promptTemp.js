const promptTemplates = {
  "MCQ": `This image contains multiple-choice questions. Return each as:
   {
    "ObjectType": "MCQ",
    "ObjectJson": {
  "_Question_":"text",
     "Answers  2":
[{"_OptionText_":"text",
"_Correct_":"Bool"
"_ChosenFeedback_":"text",
"_notChosenFeedback_":"text",
"_Tip_":"text"}]}
}

_ChosenFeedback_ is why this answer is correct or why it is wrong
_notChosenFeedback_ is why this answer is wrong or why it is correct
_Tip_ is a tip to the user to help them answer the question
write all data in same language of the question
`,


  "True False": `The uploaded image is a crop from a book page for a <”Category”: “Question”> of type <”typeName”: “True or False”> that asks to <”description”: “Determine if the following statement is True or False”>. It is required to represent it as an interactive object, hence, would you please represent it in the following Json format, so that our system can convert it into an interactive object.
 Very important Notes:
 Note1: Please give each object an appropriate expressive name in the field “ObjectName”,
 Note2: All the Json fields must be in the same language of the book, 
Note3: fill ALL the given fields of the Json (do not use null/empty), but do not give the answer, only a clue, Note4: tips or helps cannot be the same as the answer, {“Json Object”: “ObjectType”: <”typeName”: “True or False”> “ObjectName”: “statement”, “AbstractParameter”: 
{"_Question_":"text", "_Correct_":Bool} }
 Very specific notes: The field “_Question_” contains the statement to be evaluated. The field “_Correct_” contains the boolean value indicating if the statement is true (true) or false (false).
 return respons with the image language

`,

  "Mark the Word": `The uploaded image is a crop from a book page for a <”Category”: “Question”> of type <”typeName”: “Mark the Word”> that asks to <”description”: “Mark the correct word in the sentence”>.
 It is required to represent it as an interactive object, hence, extract the question and the options and represent it in the following Json format, so that our system can convert it into an interactive object. 
Very important Notes:
 Note1: Please give each object an appropriate expressive name in the field “ObjectName”,
 Note2: All the Json fields must be in the same language of the book, 
Note3: fill ALL the given fields of the Json (do not use null/empty), but do not give the answer, only a clue, Note4: tips or helps cannot be the same as the answer, {“Json Object”: “ObjectType”: <”typeName”: “Mark the Word”> “ObjectName”: “text_marking”, “AbstractParameter”:
 {"_TaskDescription_": "text", "Sentences": [ {“_Sentence_”: “text”}, {“_Answer_”: ”text”}, {“_RestSentence_”: ”text”} ] } }
 Very specific notes: 1) The field “_TaskDescription_” provides a general description of the task. 2) The array “Sentences” contains objects, where each object represents a sentence with: * “_Sentence_”: The part of the sentence before the word to be marked. * “_Answer_”: The correct word that should be marked. * “_RestSentence_”: The part of the sentence after the word to be marked.
 "ObjectName" make it short and descriptive for the questions and in the same language of the book
`,

"Image MCQ": `  The uploaded image is a crop from a book page for a <”Category”: “Question”> of type <”typeName”: “Image MCQ”> that is  <”description”: “a Question that asks to Chose the proper image that represents the correct answer from multiple optional images”>.  It is required to represent it as an interactive object, hence, would you please represent it in the following Json format, so that our system can convert it into an interactive object.  
Very important Notes:
Note1: Please give each object an appropriate expressive name in the field “ObjectName”, 
Note2: All Json fields are in the language of the book,
Note3:  fill ALL the given fields of the Json (do not use null/empty), but do not give the answer, only a clue,
Note4: tips or helps cannot be the same as the answer,
Note5: suggest a correct answer,
Note6: Do not number the elements of the array as they will be randomly ordered,
Note7:  "_ChosenFeedback_" means a feedback comment if this answer is chosen, while "_notChosenFeedback_" means a feedback comment if this answer is not chosen.  Your suggested comments should take into consideration the correctness of the option (“_Correct_”)

{"Json Object": {
    "ObjectType": <"Image MCQ">,
    "ObjectName": "text",
     "AbstractParameter": 
{"_Question_":"text","Options2":[ {"Picture" :{"_Picture_":"image", "_NormalizedCoordinates_":"(x = X, y = Y, h = H, w = W)"}, "_AltText_":"text","_HoverText_":"text","_Correct_":"Bool"}]}
}}
Image specific notes:  
1)	 “_AltText_” is a description of the image,
2)	“_HoverText_” is a tip.
Object specific notes:
1)	You need to split the image into images each is an option, crop the image and save it, then provide its URL in the Json field “_Picture_”
2)	The “_NormalizedCoordinates_” are calculated as follows:
x: horizontal offset (from left) / total image width

y: vertical offset (from top) / total image height

w: width / total image width

h: height / total image height

Where:
x,y = block/cropped image vertex (up-left corner)
w= block/cropped image width
h= block/cropped image height
use the language of the uploaded image for all text content.

Please output the raw JSON only — do not add extra explanations or formatting outside the JSON
Please return JSON without embedding base64 image data. Instead, use external image URLs or placeholders like "https://example.com/image.jpg".

`,

"Text Drag Word": `The uploaded image is a crop from a book page for a <”Category”: “Question”> of type <”typeName”: “Text Drag Words”> that asks to <”description”: “Drag the Words into the appropriate box”>.  It is required to represent it as an interactive object, hence, would you please represent it in the following Json format, so that our system can convert it into an interactive object.  
Very important Notes:
Note1: Please give each object an appropriate expressive name in the field “ObjectName”, 
Note2: All the Json fields must be in the same language of the book,
Note3:  fill ALL the given fields of the Json (do not use null/empty), but do not give the answer, only a clue,
Note4: tips or helps cannot be the same as the answer,
{“Json Object”: 
“ObjectType” : <”typeName”: “Text Drag Words”>
“ObjectName”: “text”,
“AbstractParameter”: {"Sentences":[{"_Sentence_":"text"},{"_Answer_":"text"},{"_Tip_":"text"}],"Distractors":[{"_Distractor_":"text"}]}
}
Very specific notes: 
1)  For the array “Sentences”, divide the given text into sentences (“_Sentence_”) each has a single blank (“_Answer_”) at its end.  
2)  The field “_Answer_ contains the correct answer word for the given blank.
3)  The array “Distractors” contains words (“_Distractor_”) that can be placed as wrong answers put words in the same language of the book and related to the correct answer.

`,

"Fill in the Blank": `The uploaded image is a crop from a book page for a <”Category”: “Question”> of type <”typeName”: “Fill The Blanks”> that asks to <”description”: “Complete the sentence by filling in the blank with the most appropriate word”>.  It is required to represent it as an interactive object, hence, would you please represent it in the following Json format, so that our system can convert it into an interactive object.  
Very important Notes:
Note1: Please give each object an appropriate expressive name in the field “ObjectName”, 
Note2: All the Json fields must be in the same language of the book,
Note3:  fill ALL the given fields of the Json (do not use null/empty), but do not give the answer, only a clue,
Note4: tips or helps cannot be the same as the answer,
Note5: suggest a correct answer,
{“Json Object”: 
“ObjectType” : <”typeName”: “Fill The Blanks”>
“ObjectName”: “text”,
“AbstractParameter”: {"Questions":[{"_Question_":"text","_Answer_":"text","_Tip_":"text"}]}
}
Very specific note: for the array “Questions”, divide the sentence into questions (“_Question_”) each has a single blank (“_Answer_”) at its end.
`,

"Essay": `The uploaded image is a crop from a book page for a <”Category”: “Question”> of type <”typeName”: “essay”> that asks to <”description”: “An essay is a structured piece of writing that explores a topic through argument, analysis, or narrative”>.  It is required to represent it as an interactive object, hence, would you please represent it in the following Json format, so that our system can convert it into an interactive object.  
Very important Notes:
Note1: Please give each object an appropriate expressive name in the field “ObjectName”, 
Note2: All the Json fields must be in the same language of the book,
Note3:  fill ALL the given fields of the Json (do not use null/empty), but do not give the answer, only a clue,
Note4: tips or helps cannot be the same as the answer,
Note5: suggest a correct answer,


{“Json Object”: 
“ObjectType” : <”typeName”: “Essay”>
“ObjectName”: “text”,
“AbstractParameter”: {{"_EssayQuestion_": "text"}, {"_EssayModelAnswer_": "text"}, {"_Help_": "text"}}
`,


"Sort Paragraph": `The uploaded image is a crop from a book page for a <”Category”: “Question”> of type <”typeName”: “Sort paragraph”> that asks to <”description”: “Sort paragraph into the appropriate box”>.  It is required to represent it as an interactive object, hence, would you please represent it in the following Json format, so that our system can convert it into an interactive object.  
Very important Notes:
Note1: Please give each object an appropriate expressive name in the field “ObjectName”, 
Note2: All the Json fields must be in the same language of the book,
Note3:  fill ALL the given fields of the Json (do not use null/empty), but do not give the answer, only a clue,
Note4: tips or helps cannot be the same as the answer,
{“Json Object”: 
“ObjectType” : <”typeName”: “Sort paragraph”>
“ObjectName”: “text”,
“AbstractParameter”: {
{"TaskDescription":"text"}, 
"Paragraphs": 
[{"ParagraphText":"text"}]
}
Very specific notes: 
 For the array “Paragraphs”, divide the given text into paragraphs (“ParagraphText”)

`,


};

module.exports = promptTemplates;
