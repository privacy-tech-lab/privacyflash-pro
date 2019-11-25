//
//  ViewController.swift
//  AdColonyTest
//
//  2019 Sebastian Zimmeck
//

import UIKit

class ViewController: UIViewController {
    public static var done:Bool = false

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        AdColony.configure(withAppID:"app12aa3fdb4ee64bd58c", zoneIDs: ["vz5ace06ffa30b4809b1"], options: nil, completion: completion)
        let label = UILabel(frame: CGRect(x: 0, y: 0, width: 200, height: 20))
        label.center = CGPoint(x: 100, y: 200)
        label.textAlignment = .center
        label.text = "AdColony Test running."
        self.view.addSubview(label)
        
    }
    
    func completion(zone:[AdColonyZone]){
        requestInterstitial()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func requestInterstitial() {
        print("show ad")
        AdColony.requestInterstitial(inZone: "vz5ace06ffa30b4809b1", options: nil, success: success, failure: failure)

        
    }
    
    func success1(ad: AdColonyNativeAdView)
    {
        
    }
    
    func success(ad: AdColonyInterstitial)
    {
        NSLog("success")
        ad.show(withPresenting: self)
    }
    
    func failure(error: AdColonyAdRequestError)
    {
        NSLog("error1 " + error.description)
    }

}

