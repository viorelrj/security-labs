//
//  ViewController.swift
//  security-lab
//
//  Created by Viorel Rinja on 12/1/20.
//

import UIKit
import Firebase
import Alamofire

class ViewController: UIViewController
{
    @IBOutlet weak var loginTextField: UITextField!
    @IBOutlet weak var passwordTextField: UITextField!
    @IBOutlet weak var loginButton: UIButton!
    
    let evaluators = [
      "firebase.com":
        PinnedCertificatesTrustEvaluator(certificates: [
          Certificates.stackExchange
        ])
    ]

    var session: Session?
    
    override func viewDidLoad()
    {
        super.viewDidLoad()
        
        session = Session(
            serverTrustManager: ServerTrustManager(evaluators: evaluators)
        )
    }
    
    @IBAction func logInButtonClicked(_ sender: Any) {
        register()
    }
    

    private func register()
    {
        guard let password = passwordTextField.text, let login = loginTextField.text else {
            return
        }
        
        Auth.auth().createUser(withEmail: login, password: password) { authResult, error in
          
            if error == nil
            {
                self.showAuthAlert(message: "You're logged in", title: "Success")
            }
            else {
                self.showAuthAlert(message: error?.localizedDescription ?? "", title: "Error")
            }
        }
    }
    
    private func showAuthAlert(message: String, title: String)
    {
        let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
        present(alert, animated: true, completion: nil)
    }
}

struct Certificates
{
    static let stackExchange =
        Certificates.certificate(filename: "firebase")
    
    private static func certificate(filename: String) -> SecCertificate
    {
        let filePath = Bundle.main.path(forResource: filename, ofType: "der")
        let data = try? Data(contentsOf: URL(fileURLWithPath: filePath ?? ""))
        let certificate = SecCertificateCreateWithData(nil, data as! CFData)
        return certificate!
    }
}

