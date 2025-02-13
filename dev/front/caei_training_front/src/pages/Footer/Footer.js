import '../Footer/Footer.css'
export default function Footer() {
    return (
      <footer className="footer">
        <p className="text-dark">© {new Date().getFullYear()} CAEI Training. All rights reserved.</p>
      </footer>
    );
  }
  