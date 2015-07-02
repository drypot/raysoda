/* TODO


using System;
using System.Collections;
using System.ComponentModel;
using System.Drawing;
using System.Text;
using System.Web;
using System.Web.SessionState;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Data.SqlTypes;
using Bah;
using Bah.Web;
using Bah.Web.Http;
using System.IO;
using System.Text.RegularExpressions;

namespace WebSite
{

  public class Page : Bah.Web.Page
  {
    public bool IsAdmin;
    public bool IsUserAdmin;
    public bool IsPhotoAdmin;
    public bool IsBBSAdmin;
    public bool IsStgAdmin;
    //public bool IsBBSCP;
    
    public bool IsOwner;
    public bool IsBoxPage;
    public bool IsBoxAdmin;

    new public WebSite.User User;

    public WebSite.User Owner;
    public int OwnerID;

    protected override void OnAuthorization() {
      User = (WebSite.User)base.User;

      IsAdmin = User.Principal.IsInRole("admin");
      IsUserAdmin = User.Principal.IsInRole("useradmin") || IsAdmin;
      IsPhotoAdmin= User.Principal.IsInRole("photoadmin") || IsAdmin;
      IsBBSAdmin = User.Principal.IsInRole("bbsadmin") || IsAdmin;
      IsStgAdmin = User.Principal.IsInRole("stgadmin") || IsAdmin;

      bool fAuth = true;

      IsBoxPage = LPContext.GetNDepthNode(0) != null && LPContext.GetNDepthNode(0).LID == "Box";

      if (IsBoxPage) {
        OwnerID = SafeQueryInt32("u",0);
        if (OwnerID == 0) {
          if (Context.Items["userid"] != null) {
            OwnerID = (int)Context.Items["userid"];
          }
          if (OwnerID == 0) {
            OwnerID = UserID;
            if (OwnerID == 0) {
              ShowLogin();
            } else {
              //Response.Redirect("/user/" + OwnerID);
              StringBuilder buf = new StringBuilder(LPContext.ClientUrl, 1024);
              buf.Append(LPContext.ClientUrl.IndexOf("?") > 0 ? '&' : '?').Append("u=").Append(OwnerID);
              Response.Redirect(buf.ToString());
            }
          }
        }
        Owner = WebSite.UserManager.GetUser(OwnerID);
        if (Owner == null) {
          ShowInvalidPage();
        }
        IsOwner = User.IsAuthenticated && UserID == OwnerID;
        if (IsOwner) {
          LPContext.AddTempRole("owner");
          fAuth = !LPContext.CurrentNode.CheckPermission("owner");
        }
        IsBoxPage = true;
        IsBoxAdmin = IsOwner || IsAdmin;
        LPContext.UrlMaker.AddParam("u", OwnerID);
      }

      if (fAuth) {
        base.OnAuthorization();
      }
    }

    protected override void OnPreRender(EventArgs e) {
      LPContext.OptClientInitScript += 
        "<script>" + (User.FMusic ? "userFMusic=true;" : "userFMusic=false;") + "</script>";
      if (IsBoxPage) {
        LPContext.OptClientInitScript += 
          "<script>lpOwnerID=" + OwnerID + ";lpOwnerName='" + Owner.Name + "';lpBoxSID='" + Owner.BoxSID + "';lpBoxDesc='" + Owner.BoxDesc + "'</script>";
      }
      base.OnPreRender(e);
    }

    public void AssertBoxAdmin() {
      if (!IsBoxAdmin) {
        ShowNotAllowed();
      };
    }
        
    public void AssertBoxOwner() {
      if (!IsOwner) {
        ShowNotAllowed();
      };
    }

    public void AssertStgAdmin() {
      if (!IsStgAdmin) {
        ShowNotAllowed();
      };
    }

    //    
    //    Photo Page 
    //    

    public WebSite.Com.Photo.PhotoContext PhotoContext;
    
    public void SetPhotoContext() {
      if (PhotoContext == null) {
        PhotoContext = new WebSite.Com.Photo.PhotoContext(this);
      }
    }

    //    
    //    Box Photo Page 
    //    

    public WebSite.Com.BoxPhoto.BoxPhotoContext BoxPhotoContext;
    
    public void SetBoxPhotoContext() {
      if (BoxPhotoContext == null) {
        BoxPhotoContext = new WebSite.Com.BoxPhoto.BoxPhotoContext(this);
      }
    }

    //    
    //    Note Page 
    //    

    public WebSite.Com.Note.NoteContext NoteContext;
    
    public void SetNoteContext() {
      if (NoteContext == null) {
        NoteContext = new WebSite.Com.Note.NoteContext(this);
      }
    }

    //    
    //    Card Page 
    //    

    public WebSite.Com.Card.CardContext CardContext;
    
    public void SetCardContext() {
      if (CardContext == null) {
        CardContext = new WebSite.Com.Card.CardContext(this);
      }
    }
  }

  public class UserControl : Bah.Web.UserControl {
    public new WebSite.Page Page {
      get {
        return (WebSite.Page) base.Page;
      }
    }
  }
}



*/