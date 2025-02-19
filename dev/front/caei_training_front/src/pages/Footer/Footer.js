import '../Footer/Footer.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Footer() {
  return (
    <div className="container-fluid footer-container ">
      <div className="row py-4">
        <div className="col-md-3 text-center">
          <h3 className="footer-title">Follow Us</h3>
          <div className="social-icons">
            <div className='row'>
            <a href="#" className="social-link"><i className="bi bi-facebook"></i></a>
            </div>
            <div className='row'>
            <a href="#" className="social-link"><i className="bi bi-instagram"></i></a>
            </div>
            <div className='row'>
            <a href="#" className="social-link"><i className="bi bi-linkedin"></i></a>
            </div>
          </div>
          <footer className="text-center py-3">
            <p>© {new Date().getFullYear()} CAEI Training. All rights reserved.</p>
          </footer>
        </div>
        <div className="col-md-4 text-center">
          <h3 className="footer-title">Contact Us</h3>
          <p><i className="bi bi-envelope-fill"></i> contact@caei.com</p>
          <p><i className="bi bi-telephone-fill"></i> +123 456 789</p>
          <p><i className="bi bi-geo-alt-fill"></i> 123 Street, City, Country</p>
        </div>
        <div className="col-md-4 text-center">
          <h3 className="footer-title">Leave Feedback</h3>
          <form>
            <div className="mb-2">
              <textarea
                className="form-control"
                rows="2"
                placeholder="Write your feedback..."
                required
              ></textarea>
            </div>
            <button className="btn btn-success" type="submit">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
