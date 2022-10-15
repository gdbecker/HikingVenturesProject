import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import AccountReview from '../components/AccountReview';
import Footer from '../components/Footer';

function AccountReviewsPage({ user }) {

  const [reviews, setReviews] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getData();
    }
  },[user])

  async function getData() {
    if (localStorage.getItem('access')) {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      try {
        await axios.get(`${process.env.REACT_APP_API_URL}/hvapp/reviews/`, config)
         .then(function (response) {
           let reviewArray = response.data
           let newArray = reviewArray.filter(r => r.user.id === user?.id)
           setReviews(newArray)
         })
        .catch(function (error) {
           console.log(error);
        });

      } catch (err) {
        console.log(err)
      }

      try {
        await axios.get(`${process.env.REACT_APP_API_URL}/hvapp/userfavorites/`, config)
         .then(function (response) {
           let ufArray = response.data
           let newArray = ufArray.filter(u => u.user.id == user?.id)
           setUserFavorites(newArray)
           setIsLoading(false);
         })
        .catch(function (error) {
           console.log(error);
        });

      } catch (err) {
        console.log(err)
      }
    }
  }

  if (isLoading === false) {
    return (
      <div id="account-page">
        <div className="container px-0">
          <div class="row g-2">
            <div className="col-10">
              <h1 className="account-header">your reviews</h1>
            </div>
            <div className="col-2">
            </div>
          </div>
        </div>

        <div className="container px-0">
          <div className="row g-2">
            {reviews.map((r, index) => {
                return (
                  <div className="col-md-6">
                    <AccountReview
                      user={user}
                      review={r}
                      userFavorites={userFavorites}
                    />
                  </div>
                )
            })}

          </div>
        </div>

        <Footer className="footer"/>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps)(AccountReviewsPage);
