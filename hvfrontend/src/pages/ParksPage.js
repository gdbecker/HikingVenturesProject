import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PageBanner from '../components/PageBanner';
import ParkCard from '../components/ParkCard';
import Footer from '../components/Footer';
import Images from '../assets/imgIndex';
import APIService from '../components/APIService';

function ParksPage({ user }) {

  const [parks, setParks] = useState([]);
  const [filteredParks, setFilteredParks] = useState([]);
  const [stateFilter, setStateFilter] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filterForm, setFilterForm] = useState({
    state: 'all'
  });

  const onChange = e => {
    setFilterForm({ ...filterForm, [e.target.name]: e.target.value });
    let parksToFilter = parks

    for (const [key, value] of Object.entries(filterForm)) {
      if (key === 'state') {
        if (key == e.target.name && e.target.value != 'all') {
          let filteredDown = parksToFilter.filter(p => p.state.id == e.target.value)
          setFilteredParks(filteredDown)
          parksToFilter = filteredDown
        } else if (key == e.target.name && e.target.value == 'all') {
          let filteredDown = parksToFilter
          setFilteredParks(filteredDown)
          parksToFilter = filteredDown
        } else if (value != 'all') {
          let filteredDown = parksToFilter.filter(p => p.state.id == value)
          setFilteredParks(filteredDown)
          parksToFilter = filteredDown
        } else {
          let filteredDown = parksToFilter
          setFilteredParks(filteredDown)
          parksToFilter = filteredDown
        }
      }
    }
  }

  const { state } = filterForm;

  useEffect(() => {
    if (user) {
      getData();
    }
  },[user])

  async function getData() {
    if (localStorage.getItem('access')) {
      APIService.GetParks()
      .then(response => response.json())
      .then(response => {
        setParks(response)
        setFilteredParks(response)
        const uniqueStates = [...new Map(response.map(p => [p.state['id'], p.state])).values()];
        setStateFilter(uniqueStates)
        setIsLoading(false)
      })
      .catch(error => console.log(error))
    }
  }

  if (isLoading === false) {
    return (
      <div id="parks-page">
        <PageBanner
          pageName={'parks'}
          img_url={Images.park}
        />

        <div className="container filter-form">
          <div className="row g-2">
            <div className="col-md-12">
              <form>
                <div className="row g-2">
                  <div className="col-md-3">
                    <div className="form-group">
                      <select className="form-control" onChange={(e) => onChange(e)} name="state">
                        <option value="all"> -- state -- </option>
                        {stateFilter.map((s, index) => <option key={index} value={s.id}>{s.full_name}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="container px-0">
          <div class="row g-2">

              {filteredParks.map((park) => (
                <div className="col-md-6">
                  <ParkCard
                    key={park}
                    park={park}
                    user={user}
                  />
                </div>
              ))}

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

export default connect(mapStateToProps)(ParksPage);
