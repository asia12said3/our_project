import React, { useState, useEffect } from "react";
import "./MarkTheWord.css";

const MarkTheWord = ({ data }) => {
  const [currentSentence, setCurrentSentence] = useState(0);
  const [marked, setMarked] = useState({}); // { [sentenceIndex]: bool }
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  // Parse Mark the Word data
  let mtData = data;
  if (Array.isArray(data)) mtData = data[0];
  if (mtData && mtData["Json Object"]) mtData = mtData["Json Object"];

  let sentences = [];
  let title = "Mark the Word";
  let taskDescription = "";
  if (Array.isArray(data)) {
    sentences = data.filter(item => item.ObjectType === "Mark the Word" && item.AbstractParameter).map(item => item.AbstractParameter);
    title = "Mark the Word";
  } else if (mtData?.AbstractParameter) {
    if (mtData.AbstractParameter._TaskDescription_) {
      taskDescription = mtData.AbstractParameter._TaskDescription_;
      sentences = mtData.AbstractParameter.Sentences || [];
      title = mtData.ObjectName || "Mark the Word";
    } else {
      sentences = Array.isArray(mtData.AbstractParameter) ? mtData.AbstractParameter : [];
      title = mtData.ObjectName || "Mark the Word";
    }
  } else if (mtData?.ObjectJson) {
    if (mtData.ObjectJson._TaskDescription_) {
      taskDescription = mtData.ObjectJson._TaskDescription_;
      sentences = mtData.ObjectJson.Sentences || [];
      title = mtData.ObjectName || "Mark the Word";
    } else {
      sentences = Array.isArray(mtData.ObjectJson) ? mtData.ObjectJson : [];
      title = mtData.ObjectName || "Mark the Word";
    }
  }
  const totalSentences = sentences.length;

  // Timer effect
  useEffect(() => {
    if (isStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
  }, [timeLeft, isStarted]);

  const startQuiz = () => {
    setIsStarted(true);
    setTimeLeft(totalSentences * 60);
  };

  const handleMark = (sentenceIndex) => {
    if (marked[sentenceIndex]) return;
    setMarked(prev => {
      const newMarked = { ...prev, [sentenceIndex]: true };
      return newMarked;
    });
    setScore(prev => prev + 1);
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handleNext = () => {
    if (currentSentence < totalSentences - 1) {
      setCurrentSentence(currentSentence + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSentence > 0) {
      setCurrentSentence(currentSentence - 1);
    }
  };

  const handleRetry = () => {
    setCurrentSentence(0);
    setMarked({});
    setShowResults(false);
    setScore(0);
    setIsStarted(false);
    setTimeLeft(null);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!sentences || sentences.length === 0) {
    return (
      <div className="marktheword-container">
        <div className="marktheword-error">
          <h3>No sentences available</h3>
          <p>Please upload an image and process it to see the Mark the Word questions.</p>
        </div>
      </div>
    );
  }

  if (!isStarted) {
    return (
      <div className="marktheword-container">
        <div className="marktheword-start-screen">
          <h1 className="marktheword-title">{title}</h1>
          <div className="marktheword-info">
            <p><strong>Total Sentences:</strong> {totalSentences}</p>
            <p><strong>Time Limit:</strong> {formatTime(totalSentences * 60)}</p>
            <p><strong>Instructions:</strong></p>
            <ul>
              <li>حدد الكلمة الصحيحة التي تكمل الجملة بالنقر عليها مباشرة.</li>
              <li>يمكنك الانتقال بين الجمل باستخدام الأزرار.</li>
              <li>سيتم احتساب درجة لكل إجابة صحيحة.</li>
            </ul>
          </div>
          <button className="marktheword-start-btn" onClick={startQuiz}>
            ابدأ الاختبار
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    const percentage = Math.round((score / totalSentences) * 100);
    const getFeedback = () => {
      if (percentage >= 90) return "ممتاز! عمل رائع!";
      if (percentage >= 80) return "جيد جدًا! أحسنت!";
      if (percentage >= 70) return "جيد! استمر!";
      if (percentage >= 60) return "مقبول. يمكنك التحسن!";
      return "تابع التدريب! ستتحسن!";
    };
    return (
      <div className="marktheword-container">
        <div className="marktheword-results">
          <h1 className="marktheword-title">النتيجة النهائية</h1>
          <div className="marktheword-score-card">
            <div className="marktheword-score-circle">
              <span className="marktheword-score-number">{score}</span>
              <span className="marktheword-score-total">/{totalSentences}</span>
            </div>
            <div className="marktheword-score-details">
              <h3>{percentage}%</h3>
              <p>{getFeedback()}</p>
            </div>
          </div>
          <div className="marktheword-answers-review">
            <h3>مراجعة الجمل</h3>
            {sentences.map((sentence, index) => (
              <div key={index} className="marktheword-review-item">
                <div className="marktheword-review-sentence">
                  {sentence._Sentence_} <strong>{sentence._Answer_}</strong> {sentence._RestSentence_}
                </div>
                <div className={`marktheword-review-answer ${marked[index] ? "marktheword-correct" : "marktheword-incorrect"}`}>
                  {marked[index]
                    ? "✔️ تم التحديد بشكل صحيح"
                    : "لم يتم التحديد"}
                </div>
              </div>
            ))}
          </div>
          <button className="marktheword-retry-btn" onClick={handleRetry}>
            أعد المحاولة
          </button>
        </div>
      </div>
    );
  }

  const currentS = sentences[currentSentence];

  return (
    <div className="marktheword-container">
      <div className="marktheword-header">
        <h1 className="marktheword-title">{title}</h1>
        <div className="marktheword-progress">
          <div className="marktheword-progress-bar">
            <div 
              className="marktheword-progress-fill" 
              style={{ width: `${((currentSentence + 1) / totalSentences) * 100}%` }}
            ></div>
          </div>
          <span className="marktheword-progress-text">
            الجملة {currentSentence + 1} من {totalSentences}
          </span>
        </div>
        {timeLeft && (
          <div className="marktheword-timer">
            الوقت: {formatTime(timeLeft)}
          </div>
        )}
      </div>
      {taskDescription && (
        <div className="marktheword-task-description">
          <h3>وصف المهمة</h3>
          <p>{taskDescription}</p>
        </div>
      )}
      <div className="marktheword-sentence-container" style={{ textAlign: "right", fontSize: "1.5rem", direction: "rtl" }}>
        {currentS._Sentence_} {" "}
        <span
          className={`marktheword-inline-answer ${marked[currentSentence] ? "marked-correct" : ""}`}
          style={{
            display: "inline-block",
            padding: "0.2em 0.7em",
            margin: "0 0.2em",
            borderRadius: "8px",
            background: marked[currentSentence] ? "#d4edda" : "#f0f0f0",
            color: marked[currentSentence] ? "#155724" : "#333",
            border: marked[currentSentence] ? "2px solid #27ae60" : "2px solid #ccc",
            cursor: marked[currentSentence] ? "default" : "pointer",
            fontWeight: "bold",
            position: "relative",
            transition: "all 0.2s"
          }}
          onClick={() => handleMark(currentSentence)}
        >
          {currentS._Answer_}
          {marked[currentSentence] && (
            <span style={{
              marginRight: "0.5em",
              color: "#27ae60",
              fontWeight: "bold",
              fontSize: "1.2em"
            }}>✔️</span>
          )}
          {marked[currentSentence] && (
            <span style={{
              position: "absolute",
              top: "-1.7em",
              right: "-2.5em",
              background: "#27ae60",
              color: "#fff",
              borderRadius: "12px",
              padding: "0.1em 0.7em",
              fontSize: "1.1em",
              fontWeight: "bold"
            }}>+1</span>
          )}
        </span>
        {" "}{currentS._RestSentence_}
      </div>
      <div className="marktheword-navigation">
        <button 
          className="marktheword-nav-btn" 
          onClick={handlePrevious}
          disabled={currentSentence === 0}
        >
          السابق
        </button>
        <div className="marktheword-question-dots">
          {sentences.map((_, index) => (
            <button
              key={index}
              className={`marktheword-dot ${
                index === currentSentence ? 'marktheword-dot-active' : ''
              } ${marked[index] ? 'marktheword-dot-answered' : ''}`}
              onClick={() => setCurrentSentence(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>
        {currentSentence === totalSentences - 1 ? (
          <button 
            className="marktheword-submit-btn" 
            onClick={handleSubmit}
            disabled={Object.keys(marked).length < totalSentences}
          >
            إنهاء الاختبار
          </button>
        ) : (
          <button 
            className="marktheword-nav-btn" 
            onClick={handleNext}
            disabled={!marked[currentSentence]}
          >
            التالي
          </button>
        )}
      </div>
    </div>
  );
};

export default MarkTheWord; 