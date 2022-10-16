import React, { Fragment, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ReactComponent as Delete } from '../assets/trash.svg';
import Footer from '../components/Footer';

function AdminTrailModifyPage() {

  const {id} = useParams()

  const [trails, setTrails] = useState([]);
  const [imageList, setImageList] = useState([]);

  useEffect(() => {
    getData();
    if (id !== ':id') {
      fetch(`http://127.0.0.1:8000/hvapp/trails/${id}/`, {
        'method':'GET',
        headers: {
          'Content-Type':'application/json'
        }
      })
      .then(resp => resp.json())
      .then(resp => setFormData({
        ...formData,
        trailID: resp.id,
        name: resp.name,
        description: resp.description,
        length: resp.length,
        elevationGain: resp.elevation_gain,
        park: resp.park.id,
        difficulty: resp.difficulty.id,
        routeType: resp.routetype.id,
        map_url: resp.map_url,
        img_url: resp.img_url
      }))
      .catch(error => console.log(error))

      fetch(`http://127.0.0.1:8000/hvapp/images/`, {
        'method':'GET',
        headers: {
          'Content-Type':'application/json'
        }
      })
      .then(resp => resp.json())
      .then(resp => resp.filter(i => i.trail.id == id))
      .then(resp => setImageList({
        resp
      }))
      .then(resp => console.log(resp))
      .catch(error => console.log(error))
    }

  },[]);

  async function getData() {
    if (localStorage.getItem('access')) {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      try {
        await axios.get(`${process.env.REACT_APP_API_URL}/hvapp/trails/`, config)
         .then(function (response) {
           setTrails(response.data)
         })
        .catch(function (error) {
           console.log(error);
        });

      } catch (err) {
        console.log(err)
      }
    }
  }

  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({
    trailID: '',
    name: '',
    description: '',
    length: '',
    elevationGain: '',
    park:'',
    difficulty:'',
    routeType:'',
    map_url:'',
    img_url:'',
    images:''
  });

  const { trailID, name, description, length, elevationGain, park, difficulty, routeType, map_url, img_url, images } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleTrailChange = event => {
    fetch(`http://127.0.0.1:8000/hvapp/trails/${event.target.value}/`, {
      'method':'GET',
      headers: {
        'Content-Type':'application/json'
      }
    })
    .then(resp => resp.json())
    .then(resp => setFormData({
      ...formData,
      trailID: resp.id,
      name: resp.name,
      description: resp.description,
      length: resp.length,
      elevationGain: resp.elevation_gain,
      park: resp.park.id,
      difficulty: resp.difficulty.id,
      routeType: resp.routetype.id,
      map_url: resp.map_url,
      img_url: resp.img_url
    }))
    .catch(error => console.log(error))

    fetch(`http://127.0.0.1:8000/hvapp/images/`, {
      'method':'GET',
      headers: {
        'Content-Type':'application/json'
      }
    })
    .then(resp => resp.json())
    .then(resp => setImageList(resp.filter(i => i.trail.id == event.target.value)))
    .catch(error => console.log(error))

  };

  let deleteImage = (imageID) => {
    fetch(`${process.env.REACT_APP_API_URL}/hvapp/images/${imageID}/delete/`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${localStorage.getItem('access')}`,
        'Accept': 'application/json'
      },
    })
    setImageList(imageList.filter(i => i.id != imageID))
  }

  let [parkList, setParkList] = useState([]);
  useEffect(() => {
    if (localStorage.getItem('access')) {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      try {
        axios.get(`${process.env.REACT_APP_API_URL}/hvapp/parks/`, config)
         .then(function (response) {
           setParkList(response.data)

         })
        .catch(function (error) {
           console.log(error);
        });

      } catch (err) {
        console.log(err)
      }
    }
  },[])

  let [difficultyList, setDifficultyList] = useState([]);
  useEffect(() => {
    fetch('http://127.0.0.1:8000/hvapp/difficulties/', {
      'method':'GET',
      headers: {
        'Content-Type':'application/json'
      }
    })
    .then(resp => resp.json())
    .then(resp => setDifficultyList(resp))
    .catch(error => console.log(error))
  },[])

  let [routeTypeList, setRouteTypeList] = useState([]);
  useEffect(() => {
    fetch('http://127.0.0.1:8000/hvapp/routetypes/', {
      'method':'GET',
      headers: {
        'Content-Type':'application/json'
      }
    })
    .then(resp => resp.json())
    .then(resp => setRouteTypeList(resp))
    .catch(error => console.log(error))
  },[])

  let updateTrail = async () => {
    await fetch(`${process.env.REACT_APP_API_URL}/hvapp/trails/${trailID}/update/`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${localStorage.getItem('access')}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({ name, description, length, elevationGain, park, difficulty, routeType, map_url, img_url })
    })

    console.log(images)

    if (images !== '') {
      let newImageList = images.split(";");

      for (var i = 0; i<newImageList.length; i++) {
        let new_img = newImageList[i]
        let trail = trailID

        await fetch(`${process.env.REACT_APP_API_URL}/hvapp/images/create/`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
          },
          body: JSON.stringify({ trail, new_img })
        })

      }
      setFormSent(true)
    } else {
      setFormSent(true)
    }

  }

  const onSubmitEdit = async (e) => {
    e.preventDefault();
    updateTrail()
  };

  let deleteTrail = async () => {
    await fetch(`${process.env.REACT_APP_API_URL}/hvapp/trails/${trailID}/delete/`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${localStorage.getItem('access')}`,
        'Accept': 'application/json'
      },
    })
    setFormSent(true)
  }

  const onSubmitDelete = async (e) => {
    e.preventDefault();
    deleteTrail()
  };

  if (formSent) {
    setFormData({
      trailID: '',
      name: '',
      description: '',
      length: '',
      elevationGain: '',
      park:'',
      difficulty:'',
      routeType:'',
      map_url:'',
      img_url:'',
      images: ''
    });
    window.location.reload(false);
  }

  const showImage = () => (
    <Fragment>
      <img className="admin-form-photo" src={`${img_url}`} alt="trail image"/>
    </Fragment>
  );

  return (
    <div id="admin-page">
      <div className="container px-0">
        <div class="row g-2">
          <div className="col-10">
            <h1 className="admin-header">modify trail</h1>
          </div>
          <div className="col-2">
          </div>
        </div>
      </div>


      <div className="container mt-5 account-form">
        <div className="row">
          <div className="col-9">
            <form>
              <div className="form-group">
                <select className="form-control" onChange={handleTrailChange} name="trailID" value={trailID}>
                  <option defaultValue="⬇️ Choose a trail ⬇️"> -- Choose a trail -- </option>
                  {trails.map((t, index) => <option key={index} value={t.id}>{t.name}</option>)}
                </select>
              </div>

              <div className="form-group">
                <input
                  className='form-control'
                  type='text'
                  placeholder='trail name'
                  name='name'
                  defaultValue={name}
                  onChange={e => onChange(e)}
                  required
                />
              </div>

              <div className="form-group">
                <textarea
                  className='form-control'
                  type='text'
                  placeholder='trail description'
                  name='description'
                  defaultValue={description}
                  onChange={e => onChange(e)}
                  required
                >
                </textarea>
              </div>
              <div className="form-group">
                <input
                  className='form-control'
                  type='text'
                  placeholder='length'
                  name='length'
                  defaultValue={length}
                  onChange={e => onChange(e)}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  className='form-control'
                  type='text'
                  placeholder='elevation gain'
                  name='elevationGain'
                  defaultValue={elevationGain}
                  onChange={e => onChange(e)}
                  required
                />
              </div>
              <div className="form-group">
                <select className="form-control" onChange={e => onChange(e)} name="park" value={park}>
                  <option defaultValue="⬇️ Choose a park ⬇️"> -- Choose a park -- </option>
                  {parkList.map((p, index) => <option key={index} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <select className="form-control" onChange={e => onChange(e)} name="difficulty" value={difficulty}>
                  <option defaultValue="⬇️ Choose a difficulty ⬇️"> -- Choose a difficulty -- </option>
                  {difficultyList.map((d, index) => <option key={index} value={d.id}>{d.rank}</option>)}
                </select>
              </div>
              <div className="form-group">
                <select className="form-control" onChange={e => onChange(e)} name="routeType" value={routeType}>
                  <option defaultValue="⬇️ Choose a route type ⬇️"> -- Choose a route type -- </option>
                  {routeTypeList.map((r, index) => <option key={index} value={r.id}>{r.type}</option>)}
                </select>
              </div>
              <div className="form-group">
                <input
                  className='form-control'
                  type='text'
                  placeholder='map url'
                  name='map_url'
                  defaultValue={map_url}
                  onChange={e => onChange(e)}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  className='form-control'
                  type='text'
                  placeholder='main image url'
                  name='img_url'
                  defaultValue={img_url}
                  onChange={e => onChange(e)}
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  className='form-control'
                  type='text'
                  placeholder='add additional images (separate by ;)'
                  name='images'
                  defaultValue={images}
                  onChange={e => onChange(e)}
                >
                </textarea>
              </div>
              <div className="form-group">
                <div className="container px-0">
                  <div className="row g-2">
                    {imageList.map((i, index) => {
                        return (
                          <div className="col-6" key={index}>
                            <div className="row g-2">
                              <div className="col-10">
                                <img className="admin-form-photo" src={`${i.img_url}`} alt="trail-image"/>
                              </div>
                              <div className="col-2">
                                <button onClick={() => deleteImage(i.id)} className="admin-trash-button" title="delete image">
                                  <Delete className="delete-button"/>
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                    })}
                  </div>
                </div>
              </div>
              <button className="admin-button" type="submit" onClick={e => onSubmitEdit(e)}>edit trail</button>
              <button className="admin-button" type="submit" onClick={e => onSubmitDelete(e)}>delete trail</button>
            </form>
          </div>
          <div className="col-3">
            {img_url !== '' ? showImage() : null}
          </div>
        </div>
      </div>

      <Footer className="footer"/>
    </div>
  )
}

export default AdminTrailModifyPage;
