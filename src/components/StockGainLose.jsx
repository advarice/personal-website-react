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
        const data =axios.get('http://api.yaofengc.com/testStartEndAdjusted')
            .then(response=>{
                this.setState({stockEndAdjusted:response.data})
            });
    }

/*    handleClose(event) {

        this.setState({ show: false });
    }*/

/*    handleShow(event) {
        console.log(event.target);
        this.setState({
            modal_title:event.target
        })
        this.setState({ show: true });
    }*/
    showModalRef =({handleShow})=>{
        this.showModal=handleShow;
    }

    handleClose() {
        this.setState({ show: false });
    }

    handleShow(stock) {
        let url='http://api.yaofengc.com/testNews/stock%20'+stock.stockSymbol;
        //console.log(url)
        let newsData =axios.get(url)
            .then(response=>{
/*                let articles=[]
                for(let i=0;i<3;i++){
                    if(i+1<=response.data.totalResults){
                        articles[i]=response.data[i].title;
                    }
                }*/
                this.setState({modal_article: response.data})
                //console.log(this.state.modal_article)
            });
        //console.log(stock);
        //console.log(newsData)

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
                                    {this.renderModalArticle(0)}
                                    {this.renderModalArticle(1)}
                                    {this.renderModalArticle(2)}
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