import { useState, useEffect } from 'react';

function App() {
  const [clothes, setClothes] = useState([]);
  
  // מצבים (States) עבור הטופס להוספת בגד חדש
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');

  // מצב עבור שליחת הודעה
  const [activeMessageId, setActiveMessageId] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');

  // 1. משיכת כל הבגדים מהשרת (Node.js) שלנו שמריץ על פורט 5000
  const fetchClothes = () => {
    fetch('http://localhost:5000/api/clothes')
      .then(res => res.json())
      .then(data => setClothes(data))
      .catch(err => console.error("Error fetching clothes:", err));
  };

  useEffect(() => {
    fetchClothes();
  }, []);

  // 2. פונקציה להעלאת פריט לבוש חדש
  const handleAddProduct = (e) => {
    e.preventDefault();
    
    const newProduct = { title, description, price: parseFloat(price), image_url: imageUrl, seller_email: sellerEmail };

    fetch('http://localhost:5000/api/clothes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    })
    .then(() => {
      fetchClothes(); // רענון הרשימה מחדש אחרי ההוספה
      // איפוס השדות בטופס
      setTitle(''); setDescription(''); setPrice(''); setImageUrl(''); setSellerEmail('');
      alert('המוצר הועלה בהצלחה למערכת!');
    })
    .catch(err => console.error("Error adding product:", err));
  };

  // 3. פונקציה לשליחת הודעה למוכר
  const handleSendMessage = (clothesId, receiverEmail) => {
    if (!messageText || !buyerEmail) return alert("אנא מלאו אימייל והודעה");

    const newMessage = { clothes_id: clothesId, sender_email: buyerEmail, receiver_email: receiverEmail, message_text: messageText };

    fetch('http://localhost:5000/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMessage)
    })
    .then(() => {
      alert('ההודעה נשלחה למוכר בהצלחה!');
      setMessageText('');
      setActiveMessageId(null);
    })
    .catch(err => console.error("Error sending message:", err));
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh', direction: 'rtl', textAlign: 'right' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#2c3e50' }}>👗 שוק בגדי יד שנייה - Fullstack</h1>
        <p style={{ color: '#7f8c8d' }}>פרויקט לימודי פשוט המחובר ל-PostgreSQL</p>
      </header>

      {/* חלק א': טופס הוספת מוצר */}
      <section style={{ background: 'white', padding: '25px', borderRadius: '10px', maxWidth: '600px', margin: '0 auto 40px auto', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h2 style={{ marginTop: 0, color: '#34495e' }}>📤 העלאת בגד חדש למכירה</h2>
        <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input type="text" placeholder="שם הפריט (למשל: ג'קט ג'ינס מגניב)" value={title} onChange={e => setTitle(e.target.value)} required style={inputStyle} />
          <textarea placeholder="תיאור הפריט, מידה, מצב..." value={description} onChange={e => setDescription(e.target.value)} style={inputStyle} />
          <input type="number" placeholder="מחיר בשקלים" value={price} onChange={e => setPrice(e.target.value)} required style={inputStyle} />
          <input type="text" placeholder="קישור לתמונת המוצר (URL)" value={imageUrl} onChange={e => setImageUrl(e.target.value)} style={inputStyle} />
          <input type="email" placeholder="האימייל שלך (כמוכר)" value={sellerEmail} onChange={e => setSellerEmail(e.target.value)} required style={inputStyle} />
          <button type="submit" style={{ background: '#27ae60', color: 'white', border: 'none', padding: '12px', borderRadius: '5px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}>פרסם מוצר</button>
        </form>
      </section>

      {/* חלק ב': תצוגת המוצרים */}
      <section style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ color: '#34495e', borderBottom: '2px solid #bdc3c7', paddingBottom: '10px' }}>🛒 הבגדים הזמינים לרכישה</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginTop: '20px' }}>
          {clothes.length === 0 ? <p style={{ color: '#7f8c8d' }}>אין פריטים כרגע, תהיו הראשונים להעלות!</p> : 
            clothes.map(item => (
              <div key={item.id} style={{ background: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'between', border: '1px solid #e2e8f0' }}>
                {item.image_url && <img src={item.image_url} alt={item.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />}
                <div style={{ padding: '15px', flexGrow: 1 }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>{item.title}</h3>
                  <p style={{ color: '#7f8c8d', fontSize: '14px', height: '40px', overflow: 'hidden' }}>{item.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#e74c3c' }}>₪{item.price}</span>
                    <span style={{ fontSize: '12px', color: '#95a5a6' }}>מוכר: {item.seller_email}</span>
                  </div>
                </div>

                {/* כפתור ומנגנון שליחת הודעה */}
                <div style={{ padding: '15px', background: '#f8f9fa', borderTop: '1px solid #eee' }}>
                  {activeMessageId === item.id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <input type="email" placeholder="האימייל שלך (כקונה)" value={buyerEmail} onChange={e => setBuyerEmail(e.target.value)} style={inputStyle} />
                      <input type="text" placeholder="כתוב הודעה למוכר..." value={messageText} onChange={e => setMessageText(e.target.value)} style={inputStyle} />
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button onClick={() => handleSendMessage(item.id, item.seller_email)} style={{ background: '#2980b9', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', flexGrow: 1 }}>שלח</button>
                        <button onClick={() => setActiveMessageId(null)} style={{ background: '#95a5a6', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>ביטול</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setActiveMessageId(item.id)} style={{ width: '100%', background: '#34495e', color: 'white', border: 'none', padding: '8px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>💬 צור קשר עם המוכר</button>
                  )}
                </div>
              </div>
            ))
          }
        </div>
      </section>
    </div>
  );
}

const inputStyle = {
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  fontFamily: 'Arial, sans-serif',
  fontSize: '14px',
  width: '100%',
  boxSizing: 'border-box'
};

export default App;