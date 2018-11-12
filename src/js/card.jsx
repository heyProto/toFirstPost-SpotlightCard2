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
      activeCounter: 1,
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

  selectTab(tab){
    this.setState({activeCounter:tab+1});
  }

  renderTabs(){
      let tabs =['summary','details'];
      let tabNames;
      
      tabNames = tabs.map((card,i)=>{
      let tabClass;
      tabClass = (this.state.activeCounter == i+1)  ? ((this.state.mode == "col-7")?"single-tab active":"single-tab single-tab-mobile active") : ((this.state.mode == "col-7")?"single-tab":"single-tab single-tab-mobile");
      return(
          <div key={i.toString()} className={tabClass} style={{cursor:"pointer"}} onClick={()=>this.selectTab(i)}>{tabs[i]}</div>
      )
      });
      return tabNames;
  }
  
  renderTabContent(tab){
    let data = this.state.dataJSON.data;
    switch(tab){
      case 1:
        return(
            <div className="card-content-div">
            <div>  
              <div className="single-parameter">
                  <p>{data.summary}</p>
              </div>
              <div className="single-parameter">
                <div className="parameter-label">CASE STATUS</div>
                <div className={`card-status ${this.getCardStatus(data.case_status)}`} />
                <p>{data.case_status ? data.case_status : 'Not available'}</p>
              </div>
              <div className="divider" />
              <div className="half-width-parameter">
                <div className="single-parameter">
                  <div className="parameter-label">SUBJECT</div>
                  <p>{data.subject ? data.subject : 'Not available'}</p>
                </div>
                <div className="single-parameter">
                  <div className="parameter-label">LOCATION</div>
                  <p>{data.location ? data.location : 'Not available'}</p>
                </div>
              </div>
              <div className="half-width-parameter">
                <div className="single-parameter">
                  <div className="parameter-label">COURT INVOLVED</div>
                  <p>{data.court_involved ? data.court_involved : 'Not available'}</p>
                </div>
                <div className="single-parameter">
                  <div className="parameter-label">PETITION FILING YEAR</div>
                  <p>{data.petition_filing_year ? data.petition_filing_year : 'Not available'}</p>
                </div>
              </div>
              </div>
              <div className="single-parameter content-footer">
                {data.pdf_url && <a href={data.pdf_url} target="_blank">Case file - PDF</a>}
              </div>
            </div>
        )
        break;
      case 2:
        return(
            <div className="card-content-div">
              <div className="single-parameter">
                  <div className="parameter-label">ACT REFERRED</div>
                  <p>{data.act_referred ? data.act_referred : 'Not available'}</p>
              </div>
              <div className="divider" />
              <div className="half-width-parameter">
                <div className="single-parameter">
                  <div className="parameter-label">JUDGE</div>
                  <p>{data.judge_name ? data.judge_name : 'Not available'}</p>
                </div>
                <div className="single-parameter">
                  <div className="parameter-label">BENCH</div>
                  <p>{data.bench ? data.bench : 'Not available'}</p>
                </div>
              </div>
              <div className="half-width-parameter vertical-divider">
                <div className="single-parameter">
                  <div className="parameter-label">PETITIONER (TYPE)</div>
                  <p>{data.petitioner ? data.petitioner : 'Not available'} {data.petition_type ? '(' + data.petition_type + ')' : ''}</p>
                </div>
                <div className="single-parameter">
                  <div className="parameter-label">RESPONDENT (TYPE)</div>
                  <p>{data.respondent ? data.respondent : 'Not available'} {data.respondent_type ? '(' + data.respondent_type + ')' : ''}</p>
                </div>
              </div>
              <div className="divider"/>
              <div className="half-width-parameter">
                  <div className="single-parameter">
                    <div className="parameter-label">DISPOSITION</div>
                    <p>{data.petition_result ? data.petition_result : 'Not available'}</p>
                  </div>
              </div>
              {data.compensation && <div className="half-width-parameter">
                  <div className="single-parameter">
                    <div className="parameter-label">COMPENSATION/FINE</div>
                    <p>{data.compensation ? data.compensation : 'Not available'}</p>
                  </div>
              </div>}
              <div className="single-parameter content-footer">
                {data.pdf_url && <a href={data.pdf_url} target="_blank">Case file - PDF</a>}
              </div>
            </div>
        ) 
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
