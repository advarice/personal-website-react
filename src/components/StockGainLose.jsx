import React, {Component} from 'react';
import axios  from 'axios'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Slider from "react-slick";
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import {Button, Modal} from "react-bootstrap";
import StockModal from './StockModal'
import './StockGainLose.css'


class StockGainLose extends Component {


    state = {
        stockEndAdjusted: [],
        show: false,
        modal_title: "abcd",
        modal_article:["dsa","dsada","dsafff"]
    }

    handleShow = this.handleShow.bind(this);
    handleClose = this.handleClose.bind(this);


    componentDidMount() {
        const data =axios.get('http://localhost:5000/testStartEndAdjusted')
            .then(response=>{
                this.setState({stockEndAdjusted:response.data})
            });
    }

    showModalRef =({handleShow})=>{
        this.showModal=handleShow;
    }

    handleClose() {
        this.setState({ show: false });
    }

    handleShow(stock) {
        let url='http://localhost:5000/testNews/stock%20'+stock.stockSymbol;
        //console.log(url)
        let newsData =axios.get(url)
            .then(response=>{
                this.setState({modal_article: response.data})
            });
        let urlPerfoamnce='http://localhost:5000/getStockPerformance/'+stock.stockSymbol;
        let performanceData=axios.get(urlPerfoamnce)
            .then(response=>{
                this.setState({modal_performance:response.data})
                console.log(this.state.modal_performance)
            });

        this.setState({ show: true, modal_title:stock.stockSymbol});
    }

    renderModalArticle=(props)=>{
        if(props>=this.state.modal_article.length) return null;

        return(
            <div>
                {/*<a ref={this.state.modal_article.url}<h8>{this.state.modal_article[props].title}</h8>/>*/}
                <a href={this.state.modal_article[props].url} target="_blank">{this.state.modal_article[props].title}</a>
                <br/>
                <br/>
            </div>
        )
    }

    renderModalStockPerformance=(props)=>{
        if(this.state.modal_performance==null){
            return null;
        }
        return(
            <div>
                <div>
                    <h4>Stock Information</h4>
                    <div className="row">
                        <div className="col">
                            <small className="font-weight-bold">Company Name: {this.state.modal_performance.stockEntity.name}</small>
                        </div>

                    </div>
                    <div className="row">
                        <div className="col">
                            <small className="font-weight-bold">Sector: {this.state.modal_performance.stockEntity.sector}</small>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <small className="font-weight-bold">Industry: {this.state.modal_performance.stockEntity.industry}</small>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col"><small class="font-weight-bold">Current price: {this.state.modal_performance.currentClose}</small></div>
                        <div class="col"><small class="font-weight-bold">Current Volume: {this.state.modal_performance.currentVolume}</small></div>
                    </div>
                    <div className="row">
                        <div className="col"><small>Last 7 days average price: {this.state.modal_performance.day7AvgClose.toFixed(2)}</small></div>
                        <div className="col"><small>Last 7 days average volume: {this.state.modal_performance.day7AvgVolume.toFixed(0)}</small></div>
                    </div>
                    <div class="row">
                        <div className="col"><small>Last 30 days average price: {this.state.modal_performance.day30AvgClose.toFixed(2)}</small></div>
                        <div className="col"><small>Last 30 days average volume: {this.state.modal_performance.day30AvgVolume.toFixed(0)}</small></div>
                    </div>
                    <div class="row">
                        <div className="col"><small>Last 60 days average price: {this.state.modal_performance.day60AvgClose.toFixed(2)}</small></div>
                        <div className="col"><small>Last 60 days average volume: {this.state.modal_performance.day60AvgVolume.toFixed(0)}</small></div>
                    </div>
                    <div class="row">
                        <div className="col"><small>Last 90 days average price: {this.state.modal_performance.day90AvgClose.toFixed(2)}</small></div>
                        <div className="col"><small>Last 90 days average volume: {this.state.modal_performance.day90AvgVolume.toFixed(0)}</small></div>
                    </div>
                </div>
                {this.renderSummary()}
            </div>
        )
    }

    renderSummary=(props)=>{
        let recentVolumeChange;
        let recentPriceChange;
        let getPriceChangeStatus=(change)=>{
            if(Math.abs(change)>5){
                return 'Abnormal'
            }
            else{
                return 'Normal'
            }
        }
        let getVolumeChangeStatus=(change)=>{
            if(Math.abs(change)>80){
                return 'Abnormal'
            }
            else{
                return 'Normal'
            }
        }

        if(this.state.modal_performance.currentClose>this.state.modal_performance.day7AvgClose){
            recentPriceChange=((this.state.modal_performance.currentClose-this.state.modal_performance.day7AvgClose)/this.state.modal_performance.day7AvgClose*100).toFixed(2)
        }
        else{
            recentPriceChange=((this.state.modal_performance.day7AvgClose-this.state.modal_performance.currentClose)/this.state.modal_performance.day7AvgClose*100).toFixed(2)*-1
        }

        if(this.state.modal_performance.currentVolume>this.state.modal_performance.day7AvgVolume){
            recentVolumeChange=((this.state.modal_performance.currentVolume-this.state.modal_performance.day7AvgVolume)/this.state.modal_performance.day7AvgVolume*100).toFixed(2)
        }
        else{
            recentVolumeChange=((this.state.modal_performance.day7AvgVolume-this.state.modal_performance.currentVolume)/this.state.modal_performance.day7AvgVolume*100).toFixed(2)*-1
        }

        console.log(recentPriceChange)
        return(
            <div>
                <h4>Summary</h4>
                <div class="row">
                    <div class="col">Recent 7 days Stock Price Movement: {recentPriceChange+'%'}</div>
                    <div class="col">Status: {getPriceChangeStatus(recentPriceChange)}</div>
                </div>
                <br/>
                <div className="row">
                    <div className="col">Recent 7 days Stock Volume Movement: {recentVolumeChange + '%'}</div>
                    <div className="col">Status: {getVolumeChangeStatus(recentVolumeChange)}</div>
                </div>
            </div>
        )

    }

    render() {
        var settings = {
            dots: false,
            infinite: true,
            speed: 1000,
            slidesToShow: 3,
            slidesToScroll: 3,
            arrow:true
        };
        let n=0;
        let stocksChanged= this.state.stockEndAdjusted.map(stock=>{
            let gainLoss;
            if(stock.startPrice>stock.endPrice){
                //loss
                gainLoss="Total Loss: " +((stock.startPrice-stock.endPrice)/stock.startPrice*100).toFixed(2)+"%";
            }
            else{
                //loss
                gainLoss="Total Gain: " +((stock.endPrice-stock.startPrice)/stock.startPrice*100).toFixed(2)+"%";
            }


            return(
                <div id={stock.stockSymbol} className="list-group-item list-group-item-action flex-column align-item-start my-stock-div">
                    <div className="d-flex w-100 justify-content-between">
                        <h6 id={stock.stockSymbol} className="mb-1" onClick={()=>this.handleShow(stock)}><u>{stock.stockSymbol}</u></h6>
                        <small>{stock.stockEntity.sector}</small>
                    </div>
                    <small>{stock.stockEntity.name}</small>
                    <br/>
                    <small>{stock.startDate} - {stock.endDate}</small>
                    <br/>
                    <small>{gainLoss}</small>
                    <br/>
                    <small className="text-muted">{stock.stockEntity.industry}</small>
                    <br/>
                </div>

            )
        })
        return (
            <div className="list-group">
                <Slider {...settings}>
                    {stocksChanged}
                </Slider>
                <div>
                    <Modal show={this.state.show} onHide={this.handleClose} dialogClassName="modal-90w" aria-labelledby="example-custom-modal-styling-title">
                        <Modal.Header closeButton>
                            <Modal.Title>{this.state.modal_title}</Modal.Title>
                        </Modal.Header>
                                <Modal.Body>
                                    <h4>Relevant news</h4>
                                    {this.renderModalArticle(0)}
                                    {this.renderModalArticle(1)}
                                    {this.renderModalArticle(2)}
                                </Modal.Body>
                                <hr/>
                                <Modal.Body>
                                    {this.renderModalStockPerformance()}
                                </Modal.Body>

                        <Modal.Footer>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        );
    }
}

export default StockGainLose;