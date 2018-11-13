import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

export default class toCard extends React.Component {

  constructor(props) {
    super(props)
    let stateVar = {
      fetchingData: true,
      dataJSON: {},
      optionalConfigJSON: {},
      languageTexts: undefined,
      siteConfigs: this.props.siteConfigs,
    };

    if (this.props.dataJSON) {
      stateVar.fetchingData = false;
      stateVar.dataJSON = this.props.dataJSON;
    }

    if (this.props.optionalConfigJSON) {
      stateVar.optionalConfigJSON = this.props.optionalConfigJSON;
    }

    this.state = stateVar;
  }

  exportData() {
    return this.props.selector.getBoundingClientRect();
  }

  componentDidMount() {
    if (this.state.fetchingData) {
      let items_to_fetch = [
        axios.get(this.props.dataURL)
      ];

      axios.all(items_to_fetch).then(axios.spread((card) => {
        let stateVar = {
          fetchingData: false,
          dataJSON: card.data,
          optionalConfigJSON:{},
        };
        this.setState(stateVar);
      }));
    } 
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.dataJSON) {
      this.setState({
        dataJSON: nextProps.dataJSON
      });
    }
  }

  renderCard() {
    if (this.state.fetchingData) {
      return (<div>Loading</div>)
    } else {
      let card = this.state.dataJSON.data;
      return (
        <div
            className="protograph-grid-card protograph-trigger-modal protograph-card">
              <div className="proto-social-post-card">
                <div className="post-content">
                <div className="post-category">
                    <div className="post-category-title">ACCUSED</div>
                    <div className="post-category-data">{card.accused_url ? (<a href={card.accused_url} target="_blank">{card.accused_name}</a>) : (card.accused_name ? card.accused_name : 'Unknown')}</div> 
                  </div>
                  
                </div>
                
                {card.accused_img && (<a href={card.accused_url ? card.accused_url : "#"}><img className="card-image" src={card.accused_img} /></a>)}
                
                <div className="post-categories">

                  <div className="post-category">
                    <div className="post-category-title">COMPLAINANT</div>
                    <div className="post-category-data">{card.complainant_url ? (<a href={card.complainant_url} target="_blank">{card.complainant_name}</a>) : (card.complainant_name ? card.complainant_name : 'Unknown')}</div>
                  </div>

                  <div className="post-category">
                    <div className="post-category-title">NATURE OF HARASSMENT</div>
                    <div className="post-category-data"><a href="https://p.firstpost.com/stories/dictionary-of-how-we-have-categorized-nature-of-harassment.html" target="_blank" title="Go to dictionary of classification">{card.nature && card.nature.length>0? card.nature.join(', '): 'Unknown'}</a></div>
                  </div>

                  
                
                </div>

                <div className="social-icons">
                <div className="post-category-data">{(card.news_platform != 'Social Media') && (<a href={card.news_url} className="news-link">{card.news_platform}</a>)}</div>
                  {card.social_platform == 'Facebook' && (<a href={card.social_url}><img src="https://cdn.protograph.pykih.com/Assets/social-icons/facebook-outline.png" className="card-social" /></a>)}
                  {card.social_platform == 'Twitter' && (<a href={card.social_url}><img src="https://cdn.protograph.pykih.com/Assets/social-icons/twitter-outline.png" className="card-social" /></a>)}
                </div>
              </div>
          </div>
      )
    }
  }

  render() {
    return this.renderCard();
  }
}
